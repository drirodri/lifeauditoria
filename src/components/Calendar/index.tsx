import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface Schedule {
  name: string;
  period: string;
  days: number[];
  isPG: boolean;
}

const CalendarApp: React.FC = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [days, setDays] = useState<Date[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [name, setName] = useState<string>("");
  const [period, setPeriod] = useState<string>("Diurno");
  const [dayNumbers, setDayNumbers] = useState<string>("");
  const [isPG, setIsPG] = useState<boolean>(false); // Track PG checkbox state

  const handleGenerate = () => {
    const lastDay = new Date(year, month, 0);
    const dates: Date[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month - 1, i));
    }
    setDays(dates);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form submission

    const numbers = dayNumbers
      .split(",") // Split input by commas
      .map((num) => num.trim()) // Trim whitespace
      .filter((num) => num.length > 0) // Filter out empty values
      .map((num) => Number(num)); // Convert to numbers

    // Add the new schedule to the schedules array
    const newSchedule: Schedule = {
      name,
      period,
      days: numbers,
      isPG,
    };

    setSchedules([...schedules, newSchedule]); // Add the new schedule to the array
    setName(""); // Clear the name field
    setDayNumbers(""); // Clear the days input field
  };

  const getWeeks = (dates: Date[]): Date[][] => {
    const weeks: Date[][] = [];
    let week: Date[] = [];

    dates.forEach((date) => {
      if (date.getDay() === 0 && week.length > 0) {
        weeks.push(week);
        week = [];
      }
      week.push(date);
    });

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  };

  const renderCalendar = () => {
    const weeks = getWeeks(days);

    return weeks.map((week, i) => (
      <TableRow key={`week-${i}`}>
        {Array.from({ length: 7 }).map((_, day) => {
          const currentDate = week.find((date) => date.getDay() === day);
          const scheduleForDay = currentDate
            ? schedules.filter((schedule) =>
                schedule.days.includes(currentDate.getDate())
              )
            : [];

          return (
            <TableCell key={`day-${day}`} align="center">
              {currentDate?.getDate() || ""}
              {scheduleForDay.map((schedule, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  style={{
                    color:
                      schedule.period === "Diurno"
                        ? "blue"
                        : schedule.period === "Noturno"
                        ? "red"
                        : "black",
                  }}
                >
                  {isPG ? `${schedule.name} PG` : schedule.name}
                </Typography>
              ))}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  };

  // Function to clear the calendar
  const handleClearCalendar = () => {
    setDays([]); // Reset the days
    setSchedules([]); // Reset the schedules
  };

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h4" gutterBottom>
        Auditoria
      </Typography>

      {/* Form */}
      <form onSubmit={handleAddSchedule} style={{ marginBottom: "16px" }}>
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <TextField
            select
            label="Mês"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ marginRight: "16px", width: "120px" }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Ano"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: "100px" }}
          />
        </div>

        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "16px" }}
          />

          <TextField
            select
            label="Turno"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ marginRight: "16px", width: "150px" }}
          >
            <MenuItem value="Diurno">Diurno</MenuItem>
            <MenuItem value="Noturno">Noturno</MenuItem>
          </TextField>

          <TextField
            label="Dias"
            value={dayNumbers}
            onChange={(e) => setDayNumbers(e.target.value)}
            style={{ width: "200px" }}
          />

          <FormControlLabel
            style={{ marginLeft: "5px" }}
            control={
              <Checkbox
                checked={isPG}
                onChange={(e) => setIsPG(e.target.checked)}
                color="primary"
              />
            }
            label="Pago à vista"
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginRight: "16px" }}
        >
          Adicionar Profissional
        </Button>
      </form>

      <Button variant="contained" color="secondary" onClick={handleGenerate}>
        Gerar Calendário
      </Button>

      {/* Clear Calendar Button */}
      <Button
        variant="contained"
        color="warning"
        onClick={handleClearCalendar}
        style={{ marginLeft: "16px" }}
      >
        Limpar Calendário
      </Button>

      {/* Calendar Table */}
      {days.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <Typography align="center" variant="h6">
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day, i) => (
                    <TableCell key={i} align="center">
                      {day}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>{renderCalendar()}</TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
