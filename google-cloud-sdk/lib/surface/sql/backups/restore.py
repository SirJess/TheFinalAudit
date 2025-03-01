# -*- coding: utf-8 -*- #
# Copyright 2016 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Restores a backup of a Cloud SQL instance."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.sql import api_util
from googlecloudsdk.api_lib.sql import operations
from googlecloudsdk.api_lib.sql import validate
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.kms import resource_args as kms_resource_args
from googlecloudsdk.command_lib.sql import flags
from googlecloudsdk.command_lib.sql import instances as command_util
from googlecloudsdk.command_lib.sql import validate as command_validate
from googlecloudsdk.core import log
from googlecloudsdk.core import properties
from googlecloudsdk.core.console import console_io


# 1h, based off of the max time it usually takes to create a SQL instance.
_INSTANCE_CREATION_TIMEOUT_SECONDS = 3600
# override flags , future override flags should be declared here.
OVERRIDE_FLAGS_SET = (
    'activation_policy',
    'active_directory_domain',
    'assign_ip',
    'authorized_networks',
    'availability_type',
    'backup',
    'backup_start_time',
    'backup_location',
    'cpu',
    'collation',
    'database_flags',
    'enable_bin_log',
    'retained_backups_count',
    'retained_transaction_log_days',
    'failover_replica_name',
    'maintenance_release_channel',
    'maintenance_window_day',
    'maintenance_window_hour',
    'deny_maintenance_period_start_date',
    'deny_maintenance_period_end_date',
    'deny_maintenance_period_time',
    'insights_config_query_insights_enabled',
    'insights_config_query_string_length',
    'insights_config_record_application_tags',
    'insights_config_record_client_address',
    'insights_config_query_plans_per_minute',
    'master_instance_name',
    'memory',
    'password_policy_min_length',
    'password_policy_complexity',
    'password_policy_reuse_interval',
    'password_policy_disallow_username_substring',
    'password_policy_password_change_interval',
    'enable_password_policy',
    'replica_type',
    'replication',
    'require_ssl',
    'root_password',
    'storage_auto_increase',
    'storage_size',
    'storage_provisioned_iops',
    'storage_provisioned_throughput',
    'storage_type',
    'tier',
    'edition',
    'enable_point_in_time_recovery',
    'network',
    'audit_bucket_path',
    'deletion_protection',
    'time_zone',
    'connector_enforcement',
    'timeout',
    'enable_google_private_path',
    'threads_per_core',
    'cascadable_replica',
    'enable_data_cache',
    'recreate_replicas_on_primary_crash',
    'enable_private_service_connect',
    'allowed_psc_projects',
    'ssl_mode',
    'enable_google_ml_integration',
    'database_version',
    'disk_encryption_key',
    'disk_encryption_key_keyring',
    'disk_encryption_key_location',
    'disk_encryption_key_project',
    'psc_auto_connections',
    'server_ca_mode',
    'region',
)


def AddInstanceSettingsArgs(parser):
  """Declare flag for instance settings."""
  parser.display_info.AddFormat(flags.GetInstanceListFormat())
  # (-- LINT.IfChange(instance_settings) --)
  flags.AddActivationPolicy(parser, hidden=True)
  flags.AddActiveDirectoryDomain(parser, hidden=True)
  flags.AddAssignIp(parser, hidden=True)
  flags.AddAuthorizedNetworks(parser, hidden=True)
  flags.AddAvailabilityType(parser, hidden=True)
  flags.AddBackup(parser, hidden=True)
  flags.AddBackupStartTime(parser, hidden=True)
  flags.AddBackupLocation(parser, allow_empty=False, hidden=True)
  flags.AddCPU(parser, hidden=True)
  flags.AddInstanceCollation(parser, hidden=True)
  flags.AddDatabaseFlags(parser, hidden=True)
  flags.AddEnableBinLog(parser, hidden=True)
  flags.AddRetainedBackupsCount(parser, hidden=True)
  flags.AddRetainedTransactionLogDays(parser, hidden=True)
  flags.AddFailoverReplicaName(parser, hidden=True)
  flags.AddMaintenanceReleaseChannel(parser, hidden=True)
  flags.AddMaintenanceWindowDay(parser, hidden=True)
  flags.AddMaintenanceWindowHour(parser, hidden=True)
  flags.AddDenyMaintenancePeriodStartDate(parser, hidden=True)
  flags.AddDenyMaintenancePeriodEndDate(parser, hidden=True)
  flags.AddDenyMaintenancePeriodTime(parser, hidden=True)
  flags.AddInsightsConfigQueryInsightsEnabled(parser, hidden=True)
  flags.AddInsightsConfigQueryStringLength(parser, hidden=True)
  flags.AddInsightsConfigRecordApplicationTags(parser, hidden=True)
  flags.AddInsightsConfigRecordClientAddress(parser, hidden=True)
  flags.AddInsightsConfigQueryPlansPerMinute(parser, hidden=True)
  flags.AddMasterInstanceName(parser, hidden=True)
  flags.AddMemory(parser, hidden=True)
  flags.AddPasswordPolicyMinLength(parser, hidden=True)
  flags.AddPasswordPolicyComplexity(parser, hidden=True)
  flags.AddPasswordPolicyReuseInterval(parser, hidden=True)
  flags.AddPasswordPolicyDisallowUsernameSubstring(parser, hidden=True)
  flags.AddPasswordPolicyPasswordChangeInterval(parser, hidden=True)
  flags.AddPasswordPolicyEnablePasswordPolicy(parser, hidden=True)
  flags.AddReplicaType(parser, hidden=True)
  flags.AddReplication(parser, hidden=True)
  flags.AddRequireSsl(parser, hidden=True)
  flags.AddRootPassword(parser, hidden=True)
  flags.AddStorageAutoIncrease(parser, hidden=True)
  flags.AddStorageSize(parser, hidden=True)
  flags.AddStorageProvisionedIops(parser)
  flags.AddStorageProvisionedThroughput(parser)
  flags.AddStorageType(parser, hidden=True)
  flags.AddTier(parser, hidden=True)
  flags.AddEdition(parser, hidden=True)
  kms_flag_overrides = {
      'kms-key': '--disk-encryption-key',
      'kms-keyring': '--disk-encryption-key-keyring',
      'kms-location': '--disk-encryption-key-location',
      'kms-project': '--disk-encryption-key-project',
  }
  kms_resource_args.AddKmsKeyResourceArg(
      parser, 'instance', flag_overrides=kms_flag_overrides, hidden=True
  )
  flags.AddEnablePointInTimeRecovery(parser, hidden=True)
  flags.AddNetwork(parser, hidden=True)
  flags.AddSqlServerAudit(parser, hidden=True)
  flags.AddDeletionProtection(parser, hidden=True)
  flags.AddSqlServerTimeZone(parser, hidden=True)
  flags.AddConnectorEnforcement(parser, hidden=True)
  flags.AddTimeout(parser, _INSTANCE_CREATION_TIMEOUT_SECONDS, hidden=True)
  flags.AddEnableGooglePrivatePath(
      parser, show_negated_in_help=False, hidden=True
  )
  flags.AddThreadsPerCore(parser, hidden=True)
  flags.AddCascadableReplica(parser, hidden=True)
  flags.AddEnableDataCache(parser, hidden=True)
  flags.AddRecreateReplicasOnPrimaryCrash(parser, hidden=True)
  psc_setup_group = parser.add_group(hidden=True)
  flags.AddEnablePrivateServiceConnect(psc_setup_group, hidden=True)
  flags.AddAllowedPscProjects(psc_setup_group, hidden=True)
  flags.AddPscAutoConnections(parser, hidden=True)
  flags.AddSslMode(parser, hidden=True)
  flags.AddEnableGoogleMLIntegration(parser, hidden=True)
  flags.AddEnableDataplexIntegration(parser, hidden=True)
  flags.AddLocationGroup(parser, hidden=True, specify_default_region=False)
  flags.AddDatabaseVersion(
      parser, restrict_choices=False, hidden=True, support_default_version=False
  )
  flags.AddServerCaMode(parser, hidden=True)
  # (--
  # LINT.ThenChange(
  #     ../instances/create.py:instance_settings)
  # --)


@base.DefaultUniverseOnly
@base.ReleaseTracks(base.ReleaseTrack.GA, base.ReleaseTrack.BETA,
                    base.ReleaseTrack.ALPHA)
class RestoreBackup(base.RestoreCommand):
  """Restores a backup of a Cloud SQL instance."""

  @staticmethod
  def Args(parser):
    """Args is called by calliope to gather arguments for this command.

    Args:
      parser: An argparse parser that you can use to add arguments that go
          on the command line after this command. Positional arguments are
          allowed.
    """
    flags.AddBackupId(
        parser, help_text='The ID of the backup run to restore from.'
    )
    parser.add_argument(
        '--restore-instance',
        required=True,
        completer=flags.InstanceCompleter,
        help='The ID of the target Cloud SQL instance that the backup is '
        'restored to.')
    parser.add_argument(
        '--backup-instance',
        completer=flags.InstanceCompleter,
        help='The ID of the instance that the backup was taken from. This '
        'argument must be specified when the backup instance is different '
        'from the restore instance. If it is not specified, the backup '
        'instance is considered the same as the restore instance.')
    parser.add_argument(
        '--backup-project',
        help=(
            'The project of the instance to which the backup belongs. If it'
            ' isn\'t specified, backup and restore instances are in the same '
            'project.'
        ),
    )
    base.ASYNC_FLAG.AddToParser(parser)
    AddInstanceSettingsArgs(parser)

  def Run(self, args):
    """Restores a backup of a Cloud SQL instance.

    Args:
      args: argparse.Namespace, The arguments that this command was invoked
          with.

    Returns:
      A dict object representing the operations resource describing the
      restoreBackup operation if the restoreBackup was successful.
    """

    client = api_util.SqlClient(api_util.API_VERSION_DEFAULT)
    sql_client = client.sql_client
    sql_messages = client.sql_messages

    validate.ValidateInstanceName(args.restore_instance)
    instance_ref = client.resource_parser.Parse(
        args.restore_instance,
        params={'project': properties.VALUES.core.project.GetOrFail},
        collection='sql.instances')
    if not console_io.PromptContinue(
        'All current data on the instance will be lost when the backup is '
        'restored.'):
      return None

    specified_args_dict = getattr(args, '_specified_args', None)
    override = any(key in OVERRIDE_FLAGS_SET for key in specified_args_dict)
    if command_validate.IsProjectLevelBackupRequest(args.id):
      restore_backup_request = sql_messages.SqlInstancesRestoreBackupRequest(
          project=instance_ref.project,
          instance=instance_ref.instance,
          instancesRestoreBackupRequest=sql_messages.InstancesRestoreBackupRequest(
              backup=args.id
              )
          )
      if override:
        instance_resource = (
            command_util.InstancesV1Beta4.ConstructCreateInstanceFromArgs(
                sql_messages, args, instance_ref=instance_ref
            )
        )
        restore_backup_request.instancesRestoreBackupRequest.restoreInstanceSettings = (
            instance_resource
        )
      result_operation = sql_client.instances.RestoreBackup(
          restore_backup_request
          )
    else:
      if not args.backup_instance:
        args.backup_instance = args.restore_instance
      backup_run_id = int(args.id)
      result_operation = sql_client.instances.RestoreBackup(
          sql_messages.SqlInstancesRestoreBackupRequest(
              project=instance_ref.project,
              instance=instance_ref.instance,
              instancesRestoreBackupRequest=(
                  sql_messages.InstancesRestoreBackupRequest(
                      restoreBackupContext=sql_messages.RestoreBackupContext(
                          backupRunId=backup_run_id,
                          instanceId=args.backup_instance,
                          project=args.backup_project,
                      )
                  )
              ),
          )
      )

    operation_ref = client.resource_parser.Create(
        'sql.operations',
        operation=result_operation.name,
        project=instance_ref.project)

    if args.async_:
      return sql_client.operations.Get(
          sql_messages.SqlOperationsGetRequest(
              project=operation_ref.project,
              operation=operation_ref.operation))

    operations.OperationsV1Beta4.WaitForOperation(
        sql_client, operation_ref, 'Restoring Cloud SQL instance')

    log.status.write('Restored [{instance}].\n'.format(instance=instance_ref))

    return None
