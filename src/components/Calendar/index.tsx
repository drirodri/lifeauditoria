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
  Paper,
  IconButton,
  Grid,
  Box, // Use Box for spacing
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Icon for adding new schedules
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for removing schedules

interface Schedule {
  name: string;
  period: string;
  days: number[]; // Updated to number[]
  isPG: boolean;
}

const CalendarApp: React.FC = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [days, setDays] = useState<Date[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [tempSchedules, setTempSchedules] = useState<
    { name: string; period: string; days: string; isPG: boolean }[]
  >([{ name: "", period: "Diurno", days: "", isPG: false }]); // Temporary schedules for the form

  const handleGenerate = () => {
    const lastDay = new Date(year, month, 0);
    const dates: Date[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month - 1, i));
    }
    setDays(dates);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate and process all temporary schedules
    const newSchedules = tempSchedules
      .map((schedule) => {
        const numbers = schedule.days
          .split(/[ ,.]+/) // Split by spaces, commas, or dots
          .map((num) => num.trim()) // Trim whitespace
          .filter((num) => num.length > 0) // Filter out empty values
          .map((num) => Number(num)) // Convert to numbers
          .filter((num) => !isNaN(num) && num > 0); // Filter out invalid numbers

        if (numbers.length === 0) return null; // Skip invalid schedules

        return {
          name: schedule.name,
          period: schedule.period,
          days: numbers, // Assign as number[]
          isPG: schedule.isPG,
        };
      })
      .filter((schedule) => schedule !== null) as Schedule[]; // Remove null values

    if (newSchedules.length === 0) {
      alert("Por favor, insira dias válidos para pelo menos um profissional.");
      return;
    }

    // Add new schedules to the main list
    setSchedules([...schedules, ...newSchedules]);
    setTempSchedules([{ name: "", period: "Diurno", days: "", isPG: false }]); // Reset form
  };

  const handleTempScheduleChange = (
    index: number,
    field: keyof (typeof tempSchedules)[0],
    value: string | boolean
  ) => {
    const updatedSchedules = [...tempSchedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
    setTempSchedules(updatedSchedules);
  };

  const handleAddTempSchedule = () => {
    setTempSchedules([
      ...tempSchedules,
      { name: "", period: "Diurno", days: "", isPG: false },
    ]);
  };

  const handleRemoveTempSchedule = (index: number) => {
    const updatedSchedules = tempSchedules.filter((_, i) => i !== index);
    setTempSchedules(updatedSchedules);
  };

  const getWeeks = (dates: Date[]): (Date | undefined)[][] => {
    const weeks: (Date | undefined)[][] = [];
    let week: (Date | undefined)[] = [];

    const firstDayOfMonth = dates[0].getDay();
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(undefined); // Pad the first week with undefined
    }

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
          const currentDate = week[day];
          const scheduleForDay = currentDate
            ? schedules.filter((schedule) =>
                schedule.days.includes(currentDate.getDate())
              )
            : [];

          // Check if there are overlapping schedules for the same turn
          const hasOverlap = scheduleForDay.some((schedule, index) =>
            scheduleForDay
              .slice(index + 1)
              .some((other) => other.period === schedule.period)
          );

          return (
            <TableCell
              key={`day-${day}`}
              align="center"
              sx={{
                backgroundColor: hasOverlap ? "#fff3e0" : "inherit", // Light orange for overlap
              }}
            >
              {currentDate ? currentDate.getDate() : ""}
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
                  {schedule.isPG ? `${schedule.name} PG` : schedule.name}
                </Typography>
              ))}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  };

  const handleClearCalendar = () => {
    setDays([]);
    setSchedules([]);
    setTempSchedules([{ name: "", period: "Diurno", days: "", isPG: false }]);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Auditoria
      </Typography>

      {/* Generate Calendar Form */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gerar Calendário
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Mês"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              fullWidth
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="number"
              label="Ano"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerate}
              fullWidth
            >
              Gerar Calendário
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleClearCalendar}
              fullWidth
            >
              Limpar Calendário
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Schedule Form */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Adicionar Profissionais
        </Typography>
        <form onSubmit={handleAddSchedule}>
          {tempSchedules.map((schedule, index) => (
            <Grid
              container
              marginTop={0.1}
              spacing={2}
              alignItems="center"
              key={index}
            >
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  autoComplete="off"
                  label="Nome"
                  value={schedule.name}
                  onChange={(e) =>
                    handleTempScheduleChange(index, "name", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Turno"
                  value={schedule.period}
                  onChange={(e) =>
                    handleTempScheduleChange(index, "period", e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="Diurno">Diurno</MenuItem>
                  <MenuItem value="Noturno">Noturno</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  autoComplete="off"
                  label="Dias"
                  value={schedule.days}
                  onChange={(e) =>
                    handleTempScheduleChange(index, "days", e.target.value)
                  }
                  fullWidth
                  placeholder="Ex: 1, 2, 3 ou 1 2 3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={schedule.isPG}
                      onChange={(e) =>
                        handleTempScheduleChange(
                          index,
                          "isPG",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Pago à vista"
                />
                <IconButton
                  onClick={() => handleRemoveTempSchedule(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddTempSchedule}
              sx={{ marginRight: 2 }}
            >
              Adicionar Outro Profissional
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Escalar Todos
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Calendar Table */}
      {days.length > 0 && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography align="center" variant="h6" gutterBottom>
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
        </Paper>
      )}
    </Box>
  );
};

export default CalendarApp;
