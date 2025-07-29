const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB Connection URI
const uri = "mongodb+srv://marcosol:Marco2001@cluster0.jnsnw21.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "panaderiaNubes";

app.use(cors());
app.use(express.json());

let db;

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB Atlas");
        db = client.db(dbName);
        
        // Verificar si las colecciones existen y crearlas si no existen
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        if (!collectionNames.includes('expenses')) {
            console.log("Creando colección 'expenses'");
            await db.createCollection('expenses');
        }
        
        if (!collectionNames.includes('sales')) {
            console.log("Creando colección 'sales'");
            await db.createCollection('sales');
        }
        
        console.log("Base de datos configurada correctamente");
    } catch (e) {
        console.error("Error al conectar a MongoDB:", e);
    }
}

// Ruta de estado para verificar conexión
app.get('/api/status', async (req, res) => {
    try {
        // Verificar si la conexión está activa
        const connected = !!db;
        res.json({ connected, message: connected ? 'Conectado a MongoDB' : 'No conectado a MongoDB' });
    } catch (error) {
        res.status(500).json({ connected: false, message: error.message });
    }
});

// Ruta para verificar login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Esto es una verificación simple, idealmente deberías usar hasheo de contraseñas
        if (username === 'PanaderiaNubes' && password === 'Latoso8110') {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para obtener gastos por fecha
app.get('/api/expenses/:date', async (req, res) => {
    const date = req.params.date;
    
    try {
        const expenses = await db.collection('expenses').find({ date: date }).toArray();
        console.log(`Se encontraron ${expenses.length} gastos para la fecha ${date}`);
        res.json(expenses);
    } catch (error) {
        console.error(`Error al obtener gastos para la fecha ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para guardar un gasto
app.post('/api/expenses', async (req, res) => {
    const expense = req.body;
    
    try {
        console.log('Guardando gasto:', expense);
        const result = await db.collection('expenses').insertOne(expense);
        console.log('Gasto guardado con ID:', result.insertedId);
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Error al guardar gasto:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para actualizar un gasto
app.put('/api/expenses/:id', async (req, res) => {
    const id = req.params.id;
    const expense = req.body;
    
    try {
        console.log(`Actualizando gasto con ID ${id}:`, expense);
        delete expense._id; // Eliminar _id si existe
        const result = await db.collection('expenses').updateOne(
            { _id: new ObjectId(id) },
            { $set: expense }
        );
        console.log('Resultado de actualización:', result);
        res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error(`Error al actualizar gasto con ID ${id}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para eliminar un gasto
app.delete('/api/expenses/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        console.log(`Eliminando gasto con ID ${id}`);
        const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });
        console.log('Resultado de eliminación:', result);
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error(`Error al eliminar gasto con ID ${id}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para obtener ventas por fecha
app.get('/api/sales/:date', async (req, res) => {
    const date = req.params.date;
    
    try {
        console.log(`Buscando ventas para la fecha ${date}`);
        const sale = await db.collection('sales').findOne({ date: date });
        console.log('Venta encontrada:', sale);
        res.json(sale || { date, amount: 0 });
    } catch (error) {
        console.error(`Error al obtener ventas para la fecha ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para guardar o actualizar ventas
app.post('/api/sales', async (req, res) => {
    const { date, amount } = req.body;
    
    try {
        console.log(`Guardando/actualizando venta para la fecha ${date}: $${amount}`);
        const result = await db.collection('sales').updateOne(
            { date: date },
            { $set: { date, amount } },
            { upsert: true }
        );
        console.log('Resultado:', result);
        res.json({ success: true });
    } catch (error) {
        console.error(`Error al guardar/actualizar venta para la fecha ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para eliminar ventas
app.delete('/api/sales/:date', async (req, res) => {
    const date = req.params.date;
    
    try {
        console.log(`Eliminando venta para la fecha ${date}`);
        const result = await db.collection('sales').deleteOne({ date: date });
        console.log('Resultado de eliminación:', result);
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error(`Error al eliminar venta para la fecha ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para obtener datos para reportes (rango de fechas)
app.get('/api/reports', async (req, res) => {
    const { startDate, endDate } = req.query;
    
    try {
        console.log(`Generando reporte desde ${startDate} hasta ${endDate}`);
        
        // Obtener gastos en el rango
        const expenses = await db.collection('expenses')
            .find({ date: { $gte: startDate, $lte: endDate } })
            .toArray();
        console.log(`Se encontraron ${expenses.length} gastos en el rango`);
        
        // Obtener ventas en el rango
        const sales = await db.collection('sales')
            .find({ date: { $gte: startDate, $lte: endDate } })
            .toArray();
        console.log(`Se encontraron ${sales.length} ventas en el rango`);
        
        res.json({ expenses, sales });
    } catch (error) {
        console.error(`Error al generar reporte desde ${startDate} hasta ${endDate}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Iniciar servidor después de conectar a MongoDB
connectToMongo().then(() => {
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Error al iniciar la aplicación:", err);
});