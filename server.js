import express from 'express';
import cors from 'cors';
import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trcompany',
  port: 5432
});

const app = express();
app.use(express.json());
app.use(cors());

class ClientController {
  // Получить список всех клиентов
  async getClient(req, res) {
    try {
      const client = await pool.query('SELECT * FROM client');
      res.json(client.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching client' });
    }
  }

  // Добавить нового клиента
  async addClient(req, res) {
    const { name, address, phone, discount } = req.body;
    if (!name || !address || !phone || !discount) {
      return res.status(400).json({ error: 'Name, address, and phone are required' });
    }

    try {
      const newClient = await pool.query(
        'INSERT INTO client (name, address, phone, discount) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, address, phone, discount]
      );
      res.status(201).json(newClient.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding client' });
    }
  }

  // Обновить существующего клиента
  async updateClient(req, res) {
    const { id } = req.params;
    const { name, address, phone, discount } = req.body;
    if (!name || !address || !phone || !discount) {
      return res.status(400).json({ error: 'Name, address, and phone are required' });
    }

    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    try {
      const updatedClient = await pool.query(
        'UPDATE client SET name = $1, address = $2, phone = $3, discount = $4 WHERE id = $5 RETURNING *',
        [name, address, phone, discount, clientId]
      );
      if (updatedClient.rows.length > 0) {
        res.json(updatedClient.rows[0]);
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating client' });
    }
  }

  // Удалить клиента
  async deleteClient(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    const clientId = parseInt(id, 10);
    console.log(`Deleting client with ID: ${clientId}`); // Отладочное сообщение

    try {
      const result = await pool.query('DELETE FROM client WHERE id = $1', [clientId]);
      if (result.rowCount > 0) {
        console.log(`Client with ID ${clientId} deleted successfully`); // Отладочное сообщение
        res.json({ message: 'Client deleted successfully' });
      } else {
        console.log(`Client with ID ${clientId} not found`); // Отладочное сообщение
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting client' });
    }
  }
}

class TransportController {
  // Получить список всего транспорта
  async getTransport(req, res) {
    try {
      const transport = await pool.query('SELECT * FROM transport');
      res.json(transport.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching transport' });
    }
  }

  // Добавить новый транспорт
  async addTransport(req, res) {
    const { type, cost } = req.body;
    if (!type || !cost) {
      return res.status(400).json({ error: 'Type and cost are required' });
    }

    try {
      const newTransport = await pool.query(
        'INSERT INTO transport (type, cost) VALUES ($1, $2) RETURNING *',
        [type, cost]
      );
      res.status(201).json(newTransport.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding transport' });
    }
  }

  // Обновить существующий транспорт
  async updateTransport(req, res) {
    const { id } = req.params;
    const { type, cost } = req.body;
    if (!type || !cost) {
      return res.status(400).json({ error: 'Type and cost are required' });
    }

    const transportId = parseInt(id, 10);
    if (isNaN(transportId)) {
      return res.status(400).json({ error: 'Invalid transport ID' });
    }

    try {
      const updatedTransport = await pool.query(
        'UPDATE transport SET type = $1, cost = $2 WHERE id = $3 RETURNING *',
        [type, cost, transportId]
      );
      if (updatedTransport.rows.length > 0) {
        res.json(updatedTransport.rows[0]);
      } else {
        res.status(404).json({ error: 'Transport not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating transport' });
    }
  }

  // Удалить транспорт
  async deleteTransport(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transport ID' });
    }

    const transportId = parseInt(id, 10);
    console.log(`Deleting transport with ID: ${transportId}`); // Отладочное сообщение

    try {
      const result = await pool.query('DELETE FROM transport WHERE id = $1', [transportId]);
      if (result.rowCount > 0) {
        console.log(`Transport with ID ${transportId} deleted successfully`); // Отладочное сообщение
        res.json({ message: 'Transport deleted successfully' });
      } else {
        console.log(`Transport with ID ${transportId} not found`); // Отладочное сообщение
        res.status(404).json({ error: 'Transport not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting transport' });
    }
  }
}

const clientController = new ClientController();
const transportController = new TransportController();

// Маршруты для методов клиентов
app.get('/client', (req, res) => clientController.getClient(req, res));
app.post('/client', (req, res) => clientController.addClient(req, res));
app.put('/client/:id', (req, res) => clientController.updateClient(req, res));
app.delete('/client/:id', (req, res) => clientController.deleteClient(req, res));

// Маршруты для методов транспорта
app.get('/transport', (req, res) => transportController.getTransport(req, res));
app.post('/transport', (req, res) => transportController.addTransport(req, res));
app.put('/transport/:id', (req, res) => transportController.updateTransport(req, res));
app.delete('/transport/:id', (req, res) => transportController.deleteTransport(req, res));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});