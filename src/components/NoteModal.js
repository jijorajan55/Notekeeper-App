import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const NoteModal = ({ note, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [tagline, setTagline] = useState(note.tagline);
  const [body, setBody] = useState(note.body);

  const handleSave = async () => {
    try {
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, {
        title,
        tagline,
        body,
      });
      onClose(); 
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Note</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Tagline"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
        ></textarea>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default NoteModal;
