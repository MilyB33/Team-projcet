<template>
  <v-container>
    <div>
      <TrackerForm />
    </div>
    <v-row
      align="center"
      justify="space-between"
      class="mb-6"
    >
      <v-col cols="6">
        <v-text-field
          label="What are you working on?"
          v-model="taskDescription"
          :disabled="isRunning"
          outlined
        />
      </v-col>
      <v-col cols="3">
        <v-select
          label="Select Project"
          v-model="selectedProject"
          :items="projects"
          item-value="id"
          item-title="project"
          :disabled="isRunning"
          outlined
        />
      </v-col>
      <v-col
        cols="3"
        class="d-flex align-center justify-end"
      >
        <span class="mr-4">{{ timerDisplay }}</span>
        <v-btn
          :color="isRunning ? 'red' : 'green'"
          @click="toggleTimer"
        >
          {{ isRunning ? "STOP" : "START" }}
        </v-btn>
      </v-col>
    </v-row>

    <v-list>
      <v-list-item-group
        v-for="day in daysWithTasks"
        :key="day"
      >
        <v-list-item class="day-item">
          <v-list-item>
            <v-list-item-title class="headline">{{ day }}</v-list-item-title>
          </v-list-item>
        </v-list-item>

        <v-list-item
          v-for="entry in filteredEntries(day)"
          :key="entry.id"
        >
          <v-list-item>
            <div class="entry-row d-flex">
              <div class="entry-description ellipsis">
                <v-tooltip bottom>
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">{{ entry.description }}</span>
                  </template>
                  <span>{{ entry.description }}</span>
                </v-tooltip>
              </div>

              <div class="entry-project ellipsis">
                <v-tooltip bottom>
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">{{ entry.project }}</span>
                  </template>
                  <span>{{ entry.project }}</span>
                </v-tooltip>
              </div>

              <div class="entry-time d-flex align-center">
                <span class="mr-4"
                  >{{ formatDate(entry.start_time) }} - {{ formatDate(entry.end_time) }}</span
                >
              </div>
              <div class="entry-total-time d-flex align-center">
                <span class="font-weight-bold">{{ entry.total_time }}</span>
              </div>
              <v-menu
                v-model="entry.menuOpen"
                offset-y
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    v-bind="props"
                    class="no-background"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="editTask(entry)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="confirmDelete(entry.id)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-list-item>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-dialog
      v-model="editingDialog"
      max-width="500px"
    >
      <v-card v-if="editingTask">
        <v-card-title>Edit Task</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingTask.description"
            label="Task Description"
            outlined
          />
          <v-select
            v-model="editingTask.project"
            :items="projects"
            item-value="id"
            item-title="project"
            label="Select Project"
            outlined
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="editingTask.start_time"
                label="Start Time"
                type="datetime-local"
                outlined
                @blur="validateTime"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editingTask.end_time"
                label="End Time"
                type="datetime-local"
                outlined
                @blur="validateTime"
              />
            </v-col>
          </v-row>
          <v-alert
            v-if="timeError"
            type="error"
            dense
          >
            Start time cannot be later than end time!
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="saveEditedTask"
            :disabled="timeError"
            color="green"
            >Save</v-btn
          >
          <v-btn
            @click="closeEditingDialog"
            color="black"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogDelete"
      max-width="400px"
    >
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this task?</v-card-text>
        <v-card-actions>
          <v-btn
            @click="deleteTask"
            color="red"
            >Delete</v-btn
          >
          <v-btn
            @click="cancelDelete"
            color="black"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      timeout="5000"
      location="top"
      elevation="24"
      color="green"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          color="black"
          text
          @click="snackbar = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      taskDescription: "",
      selectedProject: null, // Trzyma id projektu
      projects: [
        { id: 1, project: "Projekt1" },
        { id: 2, project: "Projekt2" },
        { id: 3, project: "Projekt3" },
      ],
      isRunning: false,
      timer: null,
      startTime: null,
      elapsedTime: 0,
      entries: [],
      tab: "Today",
      menuOpen: false,
      editingTask: null, // Trzyma edytowane zadanie
      dialogDelete: false, // Okno potwierdzenia usuwania
      editingDialog: false, // Zmienna do kontrolowania widoczności okna edycji
      startEndError: "", // Zmienna do przechowywania komunikatu o błędzie walidacji
      taskToDelete: null,
      snackbar: false, // Czy powiadomienie jest widoczne?
      snackbarMessage: "", // Treść komunikatu
      entries: [],
      timeError: false,
    };
  },
  computed: {
    timerDisplay() {
      const hours = Math.floor(this.elapsedTime / 3600);
      const minutes = Math.floor((this.elapsedTime % 3600) / 60);
      const seconds = this.elapsedTime % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    days() {
      const today = new Date();
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const days = ["Today", "Yesterday"];
      for (let i = 2; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        days.push(dayNames[day.getDay()]);
      }
      return days;
    },
    daysWithTasks() {
      return this.days.filter((day) => this.filteredEntries(day).length > 0);
    },
  },
  methods: {
    validateTime() {
      if (!this.editingTask.start_time || !this.editingTask.end_time) {
        this.timeError = false;
        return;
      }
      const startTime = this.editingTask.start_time;
      const endTime = this.editingTask.end_time;
      this.timeError = startTime >= endTime;
    },
    formatDate(datetime) {
      if (!datetime) return "Brak danych";
      const date = new Date(datetime);

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    },

    closeEditingDialog() {
      this.timeError = false;
      this.editingDialog = false;
      this.editingTask = null;
    },
    editTask(entry) {
      if (!entry || !entry.id) {
        console.error("Brak id zadania do edycji.");
        return;
      }
      this.editingTask = { ...entry };
      this.editingTask.previousProject = this.editingTask.project;
      this.editingDialog = true;

      this.timeError = false;
    },

    saveEditedTask() {
      if (this.timeError) return;
      if (!this.editingTask) {
        console.error("No task to save");
        return;
      }

      // Sprawdzamy, czy projekt nie został zmieniony
      if (this.editingTask.project !== this.editingTask.previousProject) {
        // Przypisz nazwę projektu na podstawie id, jeśli projekt się zmienił
        const projectName =
          this.projects.find((p) => p.id === this.editingTask.project)?.project || "No Project";
        console.log("Project changed, new name:", projectName);
        this.editingTask.project = projectName;
      }

      axios
        .put(`http://localhost:3001/tasks/${this.editingTask.id}`, this.editingTask)
        .then((response) => {
          this.getTasks();
          this.snackbarMessage = `Task "${this.editingTask.description}" has been successfully edited!`;
          this.snackbar = true;
          this.closeEditingDialog();
        })
        .catch((err) => {
          console.error("Błąd podczas zapisywania zadania:", err);
          alert("Błąd zapisywania zadania.");
        });
    },

    closeEditingDialog() {
      this.editingDialog = false;
      this.editingTask = null;
    },

    confirmDelete(id) {
      this.dialogDelete = true; // Pokaż okno potwierdzenia
      this.taskToDelete = id; // Zapamiętaj ID zadania
    },

    deleteTask() {
      axios
        .delete(`http://localhost:3001/tasks/${this.taskToDelete}`)
        .then(() => {
          const deletedTask = this.entries.find((entry) => entry.id === this.taskToDelete);
          this.entries = this.entries.filter((entry) => entry.id !== this.taskToDelete);
          this.dialogDelete = false;

          // Wyświetlenie powiadomienia
          this.snackbarMessage = `Task "${deletedTask?.description}" has been successfully deleted!`;
          this.snackbar = true;
        })
        .catch((err) => console.error("Błąd usuwania zadania:", err));
    },

    cancelDelete() {
      this.dialogDelete = false; // Zamknięcie okna potwierdzenia usuwania
      this.taskToDelete = null; // Resetowanie ID zadania
    },
    toggleTimer() {
      if (this.isRunning) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    },

    startTimer() {
      this.isRunning = true;
      this.startTime = new Date();
      this.timer = setInterval(() => {
        this.elapsedTime = Math.floor((new Date() - this.startTime) / 1000);
      }, 1000);
    },

    stopTimer() {
      this.isRunning = false;
      clearInterval(this.timer);

      const endTime = new Date();
      const duration = Math.floor((endTime - this.startTime) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;

      const roundedMinutes = minutes + (seconds > 0 ? 1 : 0);

      const total = `${hours.toString().padStart(2, "0")}:${roundedMinutes.toString().padStart(2, "0")}`;

      const projectName =
        this.selectedProject !== null
          ? this.projects.find((p) => p.id === this.selectedProject)?.project || "No Project"
          : "No Project";

      const entry = {
        description: this.taskDescription || "No Description",
        project: projectName,

        start_time: this.startTime.toISOString().replace("T", " ").split(".")[0],
        end_time: endTime.toISOString().replace("T", " ").split(".")[0],

        total_time: total,
        date: this.startTime.toISOString().split("T")[0],
      };
      this.snackbarMessage = `Task "${entry.description}" has been successfully completed!`;
      this.snackbar = true;
      axios
        .post("http://localhost:3001/tasks", entry)
        .then(() => {
          this.taskDescription = "";
          this.selectedProject = null;
          this.elapsedTime = 0;
          this.getTasks(); // 📌 Odświeża listę zadań po dodaniu nowego taska!
        })
        .catch((err) => console.error("Błąd zapisywania zadania:", err));
    },

    filteredEntries(day) {
      const today = new Date();
      let targetDate = new Date();
      if (day === "Today") {
        targetDate = today;
      } else if (day === "Yesterday") {
        targetDate.setDate(today.getDate() - 1);
      } else {
        const dayIndex = this.days.indexOf(day);
        targetDate.setDate(today.getDate() - dayIndex);
      }

      const targetDateString = targetDate.toISOString().split("T")[0];
      const entriesForDay = this.entries.filter((entry) => entry.date === targetDateString);
      return entriesForDay;
    },

    getTasks() {
      axios
        .get("http://localhost:3001/tasks")
        .then((response) => {
          this.entries = response.data;
        })
        .catch((err) => console.error("Błąd pobierania zadań:", err));
    },
  },
  mounted() {
    this.getTasks();
  },
};
</script>

<style>
.project-list {
  overflow-y: auto;
}
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  padding: 10px 0;
}
.v-list-item:hover {
  background-color: #f5f5f5;
}
.day-item {
  background-color: #e8e8e8;
  padding: 10px 0;
}
.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.d-flex.align-center {
  align-items: center;
}
.font-weight-bold {
  font-weight: bold;
}
.mr-4 {
  margin-right: 16px;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.entry-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entry-description,
.entry-project {
  flex: 2.5;
  padding: 0 5px;
  border-right: 1px solid #e0e0e0;
}
.entry-time {
  flex: 0.92;
  padding: 0 5px;
  border-right: 1px solid #e0e0e0;
  text-align: center;
}
.entry-total-time {
  width: 100%;
  flex: 0;
  padding: 0 5px;
  border-right: 1px solid #e0e0e0;
  text-align: center;
}

.entry-description {
  text-align: left;
}

.entry-project {
  text-align: left;
}

.entry-time {
  text-align: center;
}

.entry-description:last-child,
.entry-project:last-child {
  border-right: none;
}
.no-background {
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.no-background:hover {
  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: none;
  transform: scale(0.9);
}
</style>
