// src/controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";

// GET alle appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST nieuwe appointment
export const createAppointment = async (req, res) => {
  const { service, customerName, date, time, status } = req.body;

  try {
    const appointment = await Appointment.create({
      service,
      customerName,
      date,
      time,
      status,
      userId: req.user._id,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE appointment (verwijderen)
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Geen geldige appointment ID" });
  }

  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment niet gevonden" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
