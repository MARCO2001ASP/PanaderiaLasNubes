const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


// Middleware para servir archivos estáticos y procesar JSON
app.use(express.static('./'));
app.use(express.json());

// Configuración MongoDB
const uri = "mongodb+srv://marcosol:Marco2001@cluster0.jnsnw21.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "panaderiaNubes";

let db;

// Función para conectar a MongoDB
async function connectToMongo() {
    try {
        console.log("Intentando conectar a MongoDB Atlas...");
        await client.connect();
        console.log("Conectado a MongoDB Atlas");
        
        db = client.db(dbName);
        
        // Verificar colecciones
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        console.log("Colecciones existentes:", collectionNames);
        
        if (!collectionNames.includes('expenses')) {
            console.log("Creando colección 'expenses'");
            await db.createCollection('expenses');
        }
        
        if (!collectionNames.includes('sales')) {
            console.log("Creando colección 'sales'");
            await db.createCollection('sales');
        }
        
        // Prueba de inserción
        try {
            const testResult = await db.collection('test').insertOne({
                test: true,
                date: new Date()
            });
            console.log("Prueba de inserción exitosa, ID:", testResult.insertedId);
        } catch (testError) {
            console.warn("Advertencia en prueba de inserción:", testError.message);
        }
        
        console.log("Base de datos configurada correctamente");
        return true;
    } catch (e) {
        console.error("Error al conectar a MongoDB:", e);
        return false;
    }
}

// RUTAS API

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Servidor funcionando correctamente' });
});

// Verificar estado
app.get('/api/status', async (req, res) => {
    try {
        const connected = !!db;
        let dbActive = false;
        
        if (connected) {
            try {
                await db.command({ ping: 1 });
                dbActive = true;
            } catch (e) {
                console.error("Error en ping a MongoDB:", e);
            }
        }
        
        res.json({ 
            connected: dbActive, 
            message: dbActive ? 'Conectado a MongoDB' : 'No conectado a MongoDB',
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error en status:", error);
        res.status(500).json({ connected: false, message: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Intento de login:", { username, password: '***' });
    
    try {
        if (username === 'PanaderiaNubes' && password === 'Latoso8110') {
            console.log("Login exitoso");
            res.json({ success: true });
        } else {
            console.log("Login fallido");
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener gastos por fecha
app.get('/api/expenses/:date', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const date = req.params.date;
    console.log(`Buscando gastos para la fecha: ${date}`);
    
    try {
        const expenses = await db.collection('expenses').find({ date: date }).toArray();
        console.log(`Se encontraron ${expenses.length} gastos para la fecha ${date}`);
        res.json(expenses);
    } catch (error) {
        console.error(`Error al obtener gastos para ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Guardar un gasto
app.post('/api/expenses', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const expense = req.body;
    console.log('Guardando gasto:', expense);
    
    try {
        const result = await db.collection('expenses').insertOne(expense);
        console.log('Gasto guardado con ID:', result.insertedId);
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Error al guardar gasto:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Actualizar un gasto
app.put('/api/expenses/:id', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const id = req.params.id;
    const expense = req.body;
    console.log(`Actualizando gasto con ID ${id}:`, expense);
    
    try {
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

// Eliminar un gasto
app.delete('/api/expenses/:id', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const id = req.params.id;
    console.log(`Eliminando gasto con ID ${id}`);
    
    try {
        const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });
        console.log('Resultado de eliminación:', result);
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error(`Error al eliminar gasto con ID ${id}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener ventas por fecha
app.get('/api/sales/:date', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const date = req.params.date;
    console.log(`Buscando ventas para la fecha ${date}`);
    
    try {
        const sale = await db.collection('sales').findOne({ date: date });
        console.log('Venta encontrada:', sale);
        res.json(sale || { date, amount: 0 });
    } catch (error) {
        console.error(`Error al obtener ventas para la fecha ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Guardar o actualizar ventas
app.post('/api/sales', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const { date, amount } = req.body;
    console.log(`Guardando/actualizando venta para la fecha ${date}: $${amount}`);
    
    try {
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

// Eliminar ventas
app.delete('/api/sales/:date', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const date = req.params.date;
    console.log(`Eliminando venta para la fecha ${date}`);
    
    try {
        const result = await db.collection('sales').deleteOne({ date: date });
        console.log('Resultado de eliminación:', result);
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error(`Error al eliminar venta para la fecha ${date}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener datos para reportes (rango de fechas)
app.get('/api/reports', async (req, res) => {
    if (!db) {
        return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const { startDate, endDate } = req.query;
    console.log(`Generando reporte desde ${startDate} hasta ${endDate}`);
    
    try {
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

// Servir index.html para todas las demás rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
async function startServer() {
    const dbConnected = await connectToMongo();
    
    app.listen(port, () => {
        console.log(`Servidor completo escuchando en http://localhost:${port}`);
        console.log(`Abre tu navegador en http://localhost:${port} para acceder a la aplicación`);
        if (!dbConnected) {
            console.warn("ADVERTENCIA: El servidor se ha iniciado sin conexión a MongoDB. Se usará almacenamiento local.");
        }
    });
}

startServer().catch(err => {
    console.error("Error fatal al iniciar la aplicación:", err);
});