import escapeRoom1 from "../../assets/escapeRoom1.jpg";
import sheet1 from "../../assets/sheet1.png";
import sheet2 from "../../assets/sheet2.png";
import sheet3 from "../../assets/sheet3.png";
import learnBalanceSheet from "../../assets/learnBalanceSheet.png";
import { useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import BalanceSheetQuiz from "../missingBalanceSheet/BalanceSheetQuiz";
import { useNavigate } from "react-router-dom";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);
  console.log(user);
  return { user, loading };
}

export default function EscapeRoom() {
  const [selectedItem, setSelectedItem] = useState(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // const handleProcessPdf = async () => {
  //   const bucket_name = "nth-segment-450320-i5.firebasestorage.app";
  //   const object_path =
  //     "users/" + user.uid + "/files/" + "UGA_annual_report.pdf";
  //   try {
  //     const response = await fetch("http://localhost:5000/process-pdf", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ bucket: bucket_name, object_path: object_path }),
  //     });
  //     const result = await response.text();
  //     console.log("Processed PDF text file path:", result);
  //   } catch (error) {
  //     console.error("Error processing PDF:", error);
  //   }
  // };

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
      image: sheet1,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "liability",
      x: "298px",
      y: "825px",
      width: "60px",
      height: "33px",
      image: sheet2,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "enter_balance_sheet",
      x: "445px",
      y: "500px",
      width: "111px",
      height: "80px",
      image: "",
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "profit",
      x: "1454px",
      y: "610px",
      width: "70px",
      height: "19px",
      image: sheet3,
      borderRadius: "12px",
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
              {selectedItem.id === "enter_balance_sheet" ? (
                <BalanceSheetQuiz />
              ) : (
                <img src={selectedItem.image} alt="Popup" className="w-full" />
              )}

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
