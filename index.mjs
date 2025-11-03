import express from 'express';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const randomId = Math.floor(Math.random() * 826) + 1;
        const url = `https://rickandmortyapi.com/api/character/${randomId}`;
        const response = await fetch(url);
        const data = await response.json();

        const character = {
            name: data.name,
            status: data.status,
            species: data.species,
            image: data.image
        };

        res.render('home.ejs', { character, error: null, bgImage: character.image });
    } catch (err) {
        console.error(err);
        res.render('home.ejs', { character: null, error: "Something went wrong!", bgImage: null });
    }
});

app.get('/search', (req, res) => {
    res.render('search.ejs', { characters: null, error: null });
});

app.post('/search', async (req, res) => {
    const name = req.body.name;
    const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.render('search.ejs', { characters: null, error: data.error });
        }

        const characters = data.results.map(c => ({
            name: c.name,
            status: c.status,
            species: c.species,
            image: c.image
        }));

        res.render('search.ejs', { characters, error: null });

    } catch (err) {
        console.error(err);
        res.render('search.ejs', { characters: null, error: "Something went wrong!" });
    }
});

app.get('/faker', (req, res) => {
    const character = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        job: faker.person.jobTitle(),
        city: faker.location.city()
    };

    res.render('faker.ejs', { character });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
