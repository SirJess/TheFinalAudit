import escapeRoom2 from "../../assets/escapeRoom2.jpg";
import learnBalanceSheet from "../../assets/learnBalanceSheet.png";
import what_is_ebitda from "../../assets/what_is_ebitda.png";
import { useState } from "react";
import { motion, transform } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

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
  console.log(user, user.uid);
  return { user, loading };
}

export default function EscapeRoom2() {
  const [selectedItem, setSelectedItem] = useState(null);

  const hotspots = [
    {
      id: "explain_EBITDA",
      x: "370px",
      y: "180px",
      width: "90px",
      height: "140px",
      image: what_is_ebitda,
      borderRadius: "0px",
      boxShadow: "0px 0px 10px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "w-[450px]",
    },
    {
      id: "enter_EBITDA",
      x: "570px",
      y: "250px",
      width: "200px",
      height: "150px",
      image: learnBalanceSheet, // Change this to the poster image path
      borderRadius: "12px", // Makes edges softer
      boxShadow: "0px 0px 15px 4px rgba(255, 0, 0, 0.6)",
      imagewidth: "100px",
    },

    {
      id: "depreciation_amortization",
      x: "940px",
      y: "270px",
      width: "180px",
      height: "160px",
      image: learnBalanceSheet, // Change this to the poster image path
      borderRadius: "12px", // Makes edges softer
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "100px",
    },
    {
      id: "lost_your_data",
      x: "1145px",
      y: "545px",
      width: "75px",
      height: "40px",
      image: learnBalanceSheet, // Change this to the poster image path
      borderRadius: "0px", // Makes edges softer
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "100px",
    },
    {
      id: "lost_your_data",
      x: "495px",
      y: "765px",
      width: "90px",
      height: "40px",
      image: learnBalanceSheet, // Change this to the poster image path
      borderRadius: "0px", // Makes edges softer
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "100px",
    },
  ];

  return (
    <div className="relative w-full h-screen bg-black">
      <img
        src={escapeRoom2} // Background image
        alt="Escape Room"
        className="w-full h-full object-cover"
      />

      {hotspots.map((spot) => (
        <motion.div
          key={spot.id}
          className="absolute bg-transparent cursor-pointer"
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

      {selectedItem && (
        <Dialog.Root open={true} onOpenChange={() => setSelectedItem(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex justify-center items-center p-4">
            <div className="bg-white p-4 rounded-lg">
              <img
                src={selectedItem.image}
                alt="Popup"
                className={selectedItem.imagewidth}
              />
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
