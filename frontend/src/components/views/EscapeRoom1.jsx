import escapeRoom1 from "../../assets/escapeRoom1.jpg";
import learnBalanceSheet from "../../assets/learnBalanceSheet.png";
import { useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";

export default function EscapeRoom() {
  const [selectedItem, setSelectedItem] = useState(null);

  const hotspots = [
    {
      id: "poster",
      x: "748px",
      y: "368px",
      width: "66px",
      height: "92px",
      image: learnBalanceSheet,
      borderRadius: "0px",
      boxShadow: "0px 0px 10px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "assets",
      x: "825px",
      y: "785px",
      width: "78px",
      height: "33px",
      image: learnBalanceSheet,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "liability",
      x: "298px",
      y: "825px",
      width: "60px",
      height: "33px",
      image: learnBalanceSheet,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "enter_balance_sheet",
      x: "445px",
      y: "500px",
      width: "111px",
      height: "80px",
      image: learnBalanceSheet,
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "profit",
      x: "1454px",
      y: "610px",
      width: "70px",
      height: "19px",
      image: learnBalanceSheet,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "share_folder_equity",
      x: "1548px",
      y: "834px",
      width: "79px",
      height: "30px",
      image: learnBalanceSheet,
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "share_folder_equity",
      x: "1370px",
      y: "334px",
      width: "45px",
      height: "80px",
      image: learnBalanceSheet,
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "share_folder_equity",
      x: "1010px",
      y: "360px",
      width: "45px",
      height: "40px",
      image: learnBalanceSheet,
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
  ];

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Background Image */}
      <img
        src={escapeRoom1}
        alt="Escape Room"
        className="w-full h-full object-cover z-0"
      />

      {/* Hotspots */}
      {hotspots.map((spot) => (
        <motion.div
          key={spot.id}
          className="absolute bg-transparent cursor-pointer z-10" // Set z-index to ensure it's above the background
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.width,
            height: spot.height,
            boxShadow: spot.boxShadow,
            borderRadius: spot.borderRadius,
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setSelectedItem(spot)}
        />
      ))}

      {/* Popup Dialog */}
      {selectedItem && (
        <Dialog.Root open={true} onOpenChange={() => setSelectedItem(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-20" />{" "}
          {/* Ensure overlay is on top */}
          <Dialog.Content className="fixed inset-0 flex justify-center items-center p-4 z-30">
            <div className="bg-white p-4 rounded-lg">
              <img src={selectedItem.image} alt="Popup" className="w-full" />
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
}
