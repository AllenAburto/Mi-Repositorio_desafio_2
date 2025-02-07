const express = require('express');
const app = express();
const fs = require('fs');

const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Mi Repositorio');
});

app.get('/canciones', (req, res) => {
    fs.readFile('repositorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el JSON.');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    fs.readFile('repositorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el JSON.');
            return;
        }
        let repositorio = JSON.parse(data);
        repositorio.push(nuevaCancion);
        fs.writeFile('repositorio.json', JSON.stringify(repositorio), err => {
            if (err) {
                res.status(500).send('Error al guardar canción.');
                return;
            }
            res.status(201).send('Canción Agregada.');
        });
    });
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancionActualizada = req.body;

    fs.readFile('repositorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el JSON.');
            return;
        }
        let repositorio = JSON.parse(data);
        let index = repositorio.findIndex(c => c.id == id);
        if (index !== -1) {
            repositorio[index] = cancionActualizada;
            fs.writeFile('repositorio.json', JSON.stringify(repositorio), err => {
                if (err) {
                    res.status(500).send('Error al actualizar.');
                    return;
                }
                res.send('Actualización Realizada.');
            });
        } else {
            res.status(404).send('Canción no encontrada.');
        }
    });
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('repositorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el JSON.');
            return;
        }

        let repositorio = JSON.parse(data);
        let index = repositorio.findIndex(c => c.id == id);

        if (index === -1) {
            res.status(404).send('Canción no encontrada.');
            return;
        }

        repositorio.splice(index, 1);

        fs.writeFile('repositorio.json', JSON.stringify(repositorio, null, 2), err => {
            if (err) {
                res.status(500).send('Error al eliminar.');
                return;
            }
            res.send('Canción Eliminada.');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Activo en http://localhost:${PORT}`);
});