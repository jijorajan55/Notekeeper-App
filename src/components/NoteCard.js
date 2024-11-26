import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const NoteCard = ({ note, onEdit }) => {
  const handlePin = async () => {
    try {
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, { pinned: !note.pinned });
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  };

  return (
    <div className={`note-card ${note.pinned ? "pinned" : ""}`}>
      <h2>{note.title}</h2>
      <h4>{note.tagline}</h4>
      <p>{note.body}</p>
      <div className="note-card-actions">
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button className="pin-button" onClick={handlePin}>
          {note.pinned ? "Unpin" : "Pin"}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
