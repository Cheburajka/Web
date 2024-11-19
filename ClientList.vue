<template>
  <div>
    <h1>Список клиентов</h1>

    <div>
      <label for="showClient">Показать клиентов в БД:</label>
      <select id="showClient" v-model="selectedClient">
        <option v-for="client in lstClient" :value="client" :key="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>

    <div>
      <button @click="toggleAddClientForm">Добавить клиента</button>
    </div>

    <div>
      <button @click="toggleUpdateClientForm">Обновить клиента</button>
      <select v-if="showUpdateClientForm" v-model="selectedClientForUpdate">
        <option v-for="client in lstClient" :value="client" :key="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>

    <div>
      <button @click="toggleDeleteClientForm">Удалить клиента</button>
      <select v-if="showDeleteClientForm" v-model="selectedClientForDelete">
        <option v-for="client in lstClient" :value="client" :key="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>

    <!-- Форма для добавления нового клиента -->
    <div v-if="showAddClientForm">
      <h2>Добавить нового клиента</h2>
      <p>Имя: <input v-model="newClient.name"></p>
      <p>Адрес: <input v-model="newClient.address"></p>
      <p>Телефон: <input v-model="newClient.phone"></p>
      <p>Скидка: <input v-model="newClient.discount"></p>
      <button @click="addClient">Сохранить клиента</button>
    </div>

    <!-- Форма для обновления информации о клиенте -->
    <div v-if="showUpdateClientForm && selectedClientForUpdate">
      <h2>Обновить информацию о клиенте</h2>
      <p>Имя: <input v-model="selectedClientForUpdate.name"></p>
      <p>Адрес: <input v-model="selectedClientForUpdate.address"></p>
      <p>Телефон: <input v-model="selectedClientForUpdate.phone"></p>
      <p>Скидка: <input v-model="selectedClientForUpdate.discount"></p>
      <button @click="saveUpdatedClient">Сохранить изменения</button>
    </div>

    <!-- Форма для удаления клиента -->
    <div v-if="showDeleteClientForm && selectedClientForDelete">
      <h2>Удалить клиента</h2>
      <p>Вы уверены, что хотите удалить клиента {{ selectedClientForDelete.name }}?</p>
      <button @click="confirmDeleteClient">Да, удалить</button>
    </div>

    <!-- Информация о выбранном клиенте -->
    <div v-if="selectedClient">
      <h2>Информация о клиенте</h2>
      <p>Имя: <input v-model="selectedClient.name"></p>
      <p>Адрес: <input v-model="selectedClient.address"></p>
      <p>Телефон: <input v-model="selectedClient.phone"></p>
      <p>Скидка: <input v-model="selectedClient.discount"></p>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      lstClient: [],
      selectedClient: null,
      selectedClientForUpdate: null,
      selectedClientForDelete: null,
      newClient: {
        name: '',
        address: '',
        phone: '',
        discount: ''
      },
      showAddClientForm: false,
      showUpdateClientForm: false,
      showDeleteClientForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/client');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        const data = res.data;
        this.lstClient = data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddClientForm: function() {
      this.showAddClientForm = !this.showAddClientForm;
      if (!this.showAddClientForm) {
        this.newClient = {
          name: '',
          address: '',
          phone: '',
          discount: ''
        };
      }
    },
    toggleUpdateClientForm: function() {
      this.showUpdateClientForm = !this.showUpdateClientForm;
      if (!this.showUpdateClientForm) {
        this.selectedClientForUpdate = null;
      }
    },
    toggleDeleteClientForm: function() {
      this.showDeleteClientForm = !this.showDeleteClientForm;
      if (!this.showDeleteClientForm) {
        this.selectedClientForDelete = null;
      }
    },
    addClient: async function() {
      if (!this.newClient.name || !this.newClient.address || !this.newClient.phone) {
        console.log('Введите имя, адрес и телефон');
        return;
      }
      try {
        const res = await axios.post(this.host + '/client', this.newClient);
        this.lstClient.push(res.data);
        this.toggleAddClientForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedClient: async function() {
      if (!this.selectedClientForUpdate) {
        console.log('Выберите клиента для обновления');
        return;
      }
      const updatedClient = {
        id: this.selectedClientForUpdate.id,
        name: this.selectedClientForUpdate.name,
        address: this.selectedClientForUpdate.address,
        phone: this.selectedClientForUpdate.phone,
        discont: this.selectedClientForUpdate.discount
      };
      try {
        const res = await axios.put(this.host + '/client/' + updatedClient.id, updatedClient);
        const index = this.lstClient.findIndex(client => client.id === res.data.id);
        this.lstClient.splice(index, 1, res.data);
        this.toggleUpdateClientForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteClient: async function() {
      if (!this.selectedClientForDelete) {
        console.log('Выберите клиента для удаления');
        return;
      }
      try {
        const res = await axios.delete(this.host + '/client/' + this.selectedClientForDelete.id);
        const index = this.lstClient.findIndex(client => client.id === res.data.id);
        this.lstClient.splice(index, 1);
        this.toggleDeleteClientForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>