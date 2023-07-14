//rfce
import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';

function AddNote(props) {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})
    const handleClick = (e) =>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "",description: "",tag: ""})
        props.showAlert("Added successfully", "success");
    }
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">title</label>
                    <input type="text" className="form-control" id="title" name='title'    placeholder="Add Title Here"  value={note.title} onChange={onChange}  minLength={5} required  />
                </div>
                <div className="mb-3" >
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="desc" name='description' rows="3"  value={note.description}   onChange={onChange}  minLength={5} required  />
                </div>
                <div className="mb-3" >
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input className="form-control"   id="tag" name='tag' rows="3"  value={note.tag} onChange={onChange} />
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type='submit' className="btn btn-primary" onClick={handleClick} minLength={5} required >Add Note</button>
            </form>
        </div>
    )
}

export default AddNote