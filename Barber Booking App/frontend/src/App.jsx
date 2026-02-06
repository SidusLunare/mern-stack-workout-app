import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/style.css";

function App({ onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const services = [
    {
      id: 1,
      name: "Knip",
      price: 25,
      description: "Standaard knipbeurt",
    },
    {
      id: 2,
      name: "Fade",
      price: 30,
      description: "Fade haircut",
    },
    {
      id: 3,
      name: "Baard",
      price: 15,
      description: "Baard trimmen",
    },
  ];
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Uitgelogd");
    onLogout();
    navigate("/login");
  };

  // READ - Haal alle appointments op
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Niet ingelogd");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAppointments(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAppointments();
  }, []);

  // CREATE - Nieuwe appointment toevoegen
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!service || !customerName || !date || !time || !status) {
      alert("Vul alle velden in");
      return;
    }

    const appointment = {
      service: service,
      customerName: customerName,
      date: date,
      time: time,
      status: status,
    };

    try {
      const response = await fetch("http://localhost:4000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(appointment),
      });

      const data = await response.json();

      if (response.ok) {
        setAppointments([data, ...appointments]); // Voeg toe aan lijst
        setDate("");
        setTime("");
        setCustomerName("");
        setService("");
        setStatus("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // DELETE - Appointment verwijderen
  const handleDelete = async (id) => {
    if (!confirm("Weet je het zeker?")) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        setAppointments(appointments.filter((a) => a._id !== id)); // Verwijder uit lijst
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Appointments</h1>
        <button onClick={handleLogout} className="button button--logout">
          Uitloggen
        </button>
      </div>

      {/* CREATE Form */}
      <form className="flex flex--horizontal" onSubmit={handleSubmit}>
        <div className="flex flex--vertical">
          <label htmlFor="services">Service:</label>
          <select
            name="services"
            id="services"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required={true}
          >
            <option value="">-- Selecteer een service --</option>
            {services.map((service) => (
              <option value={service.name} key={service.id}>
                {service.name} - €{service.price}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date"
          format="DD-MM-YYYY"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button type="submit">Toevoegen</button>
      </form>

      {/* READ - Toon appointments */}
      {appointments.length === 0 ? (
        <p>Geen appointments gevonden</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id}>
            <h3>{appointment.service}</h3>
            <p>Customer: {appointment.customerName}</p>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <p>Status: {appointment.status}</p>
            <button onClick={() => handleDelete(appointment._id)}>
              Verwijderen
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
