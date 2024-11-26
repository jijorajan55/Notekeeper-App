import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; 
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NoteGrid = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const notesPerPage = 6; 

  
  useEffect(() => {
    const q = query(
      collection(db, "notes"),
      orderBy("pinned", "desc"), 
      orderBy("createdAt", "desc") 
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesArray);
    });

    return () => unsubscribe(); 
  }, []);

  const handleAddNote = async () => {
    if (!title || !body) {
      toast.error("Title and Body are required!", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "notes"), {
        title,
        tagline,
        body,
        pinned: false, 
        createdAt: serverTimestamp(),
      });
      toast.success("Note added successfully!", { position: "top-center" });
      setTitle("");
      setTagline("");
      setBody("");
    } catch (error) {
      toast.error("Error adding note. Please try again.", { position: "top-center" });
      console.error("Error adding note:", error);
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const paginatedNotes = notes.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (endIndex < notes.length) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (startIndex > 0) setCurrentPage((prev) => prev - 1);
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
  };

  const closeEditModal = () => {
    setSelectedNote(null);
  };

  return (
    <div className="note-grid-container">
      {/* Welcome Note */}
      <div className="welcome-note">
        <h2>Welcome to Notekeeper!</h2>
        <p>Create, pin, and manage your notes with ease.</p>
      </div>

      {/* Add Note Form */}
      <div className="add-note">
        <h2>Add a New Note</h2>
        <input
          type="text"
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="Tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          className="button"
          onClick={handleAddNote}
          disabled={loading}
        >
          {loading ? "Adding Note..." : "Add Note"}
        </button>
      </div>

      {/* Display Notes */}
      <div className="note-grid">
        {paginatedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => openEditModal(note)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={endIndex >= notes.length}>
          Next
        </button>
      </div>

      {/* Editable Modal */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default NoteGrid;
