import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App({ onLogout }) {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Uitgelogd");
    onLogout();
    navigate("/login");
  };

  // READ - Haal alle workouts op
  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Niet ingelogd");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/workouts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setWorkouts(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkouts();
  }, []);

  // CREATE - Nieuwe workout toevoegen
  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = {
      title,
      reps: Number(reps),
      load: Number(load),
    };

    try {
      const response = await fetch("http://localhost:4000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });

      const data = await response.json();

      if (response.ok) {
        setWorkouts([data, ...workouts]); // Voeg toe aan lijst
        setTitle("");
        setReps("");
        setLoad("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // DELETE - Workout verwijderen
  const handleDelete = async (id) => {
    if (!confirm("Weet je het zeker?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/workouts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWorkouts(workouts.filter((w) => w._id !== id)); // Verwijder uit lijst
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Workouts</h1>
        <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
          Uitloggen
        </button>
      </div>

      {/* CREATE Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <input
          type="number"
          placeholder="Load (kg)"
          value={load}
          onChange={(e) => setLoad(e.target.value)}
        />
        <button type="submit">Toevoegen</button>
      </form>

      {/* READ - Toon workouts */}
      {workouts.length === 0 ? (
        <p>Geen workouts gevonden</p>
      ) : (
        workouts.map((workout) => (
          <div key={workout._id}>
            <h3>{workout.title}</h3>
            <p>Reps: {workout.reps}</p>
            <p>Load: {workout.load} kg</p>
            <button onClick={() => handleDelete(workout._id)}>
              Verwijderen
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
