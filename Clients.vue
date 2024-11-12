<template>
  <div>
    <h2>Клиенты</h2>
    <button @click="showAddForm = true">Добавить клиента</button>
    <button @click="showUpdateForm = true" :disabled="clients.length === 0">Обновить клиента</button>
    <button @click="showDeleteForm = true" :disabled="clients.length === 0">Удалить клиента</button>

    <!-- Форма для добавления клиента -->
    <div v-if="showAddForm">
      <h3>Добавить клиента</h3>
      <form @submit.prevent="addClient">
        <input v-model="newClient.name" placeholder="Имя" required />
        <input v-model="newClient.address" placeholder="Адрес" required />
        <input v-model="newClient.phone" placeholder="Телефон" required />
        <input v-model="newClient.discount" type="number" placeholder="Скидка" required />
        <button type="submit">Добавить</button>
        <button type="button" @click="showAddForm = false">Отмена</button>
      </form>
    </div>

    <!-- Форма для обновления клиента -->
    <div v-if="showUpdateForm">
      <h3>Обновить клиента</h3>
      <form @submit.prevent="updateClient">
        <select v-model="selectedClient" required>
          <option disabled value="">Выберите клиента</option>
          <option v-for="client in clients" :value="client" :key="client.id">
            {{ client.name }}
          </option>
        </select>
        <input v-model="selectedClient.name" placeholder="Имя" required v-if="selectedClient" />
        <input v-model="selectedClient.address" placeholder="Адрес" required v-if="selectedClient" />
        <input v-model="selectedClient.phone" placeholder="Телефон" required v-if="selectedClient" />
        <input v-model="selectedClient.discount" type="number" placeholder="Скидка" required v-if="selectedClient" />
        <button type="submit">Обновить</button>
        <button type="button" @click="showUpdateForm = false">Отмена</button>
      </form>
    </div>

    <!-- Форма для удаления клиента -->
    <div v-if="showDeleteForm">
      <h3>Удалить клиента</h3>
      <form @submit.prevent="deleteClient">
        <select v-model="selectedClient" required>
          <option disabled value="">Выберите клиента</option>
          <option v-for="client in clients" :value="client" :key="client.id">
            {{ client.name }}
          </option>
        </select>
        <button type="submit">Удалить</button>
        <button type="button" @click="showDeleteForm = false">Отмена</button>
      </form>
    </div>

    <ul>
      <li v-for="client in clients" :key="client.id">
        {{ client.name }} - {{ client.address }} - {{ client.phone }} - {{ client.discount }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clients: [], // Массив клиентов
      newClient: {
        name: '',
        address: '',
        phone: '',
        discount: ''
      },
      selectedClient: null,
      showAddForm: false,
      showUpdateForm: false,
      showDeleteForm: false,
    };
  },
  methods: {
    addClient() {
      const client = {
        id: Date.now(), // Генерация уникального идентификатора
        name: this.newClient.name,
        address: this.newClient.address,
        phone: this.newClient.phone,
        discount: this.newClient.discount,
      };
      this.clients.push(client);
      this.resetNewClient();
      this.showAddForm = false; // Скрываем форму
    },
    updateClient() {
      const index = this.clients.findIndex(client => client.id === this.selectedClient.id);
      if (index !== -1) {
        this.clients[index] = { ...this.selectedClient }; // Обновление данных клиента
      }
      this.selectedClient = null; // Сбрасываем выбранного клиента
      this.showUpdateForm = false; // Скрываем форму
    },
    deleteClient() {

      this.clients = this.clients.filter(client => client.id !== this.selectedClient.id); // Удаление клиента
      this.selectedClient = null; // Сбрасываем выбранного клиента
      this.showDeleteForm = false; // Скрываем форму
    },
    resetNewClient() {
      this.newClient.name = '';
      this.newClient.address = '';
      this.newClient.phone = '';
      this.newClient.discount = '';
    }
  }
};
</script>

<style scoped>
button {
  margin: 5px;
}
form {
  margin-bottom: 20px;
}
input, select {
  display: block;
  margin: 5px 0;
  padding: 8px;
  width: 200px;
}
ul {
  margin-top: 20px;
}
</style>
