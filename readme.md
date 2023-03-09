<p align="center"><img src="https://i.postimg.cc/5y3cbRLs/logo-sekawan.png" width="100%"></p>

## About this Project

This project is created for intership test in [Sekawan Media](https://www.sekawanmedia.co.id/) as a Backend Developer (Node JS).

Credits by Muhammad Ilham Adi Pratama

## Desain Database

[![image.png](https://i.postimg.cc/6qtmgQV9/image.png)](https://postimg.cc/r0ZjtMYb)

## Depedencies

- [Express JS](https://expressjs.com/).
- [Knex](https://knexjs.org/).
- [JSON Web Token](https://www.npmjs.com/package/@types/jsonwebtoken).
- [My SQL](https://www.npmjs.com/package/mysql).
- [Bcrypt](https://www.npmjs.com/package/bcrypt).
- [Cookie Parser](https://www.npmjs.com/package/cookie-parser).
- [Body Parser](https://www.npmjs.com/package/body-parser).
- [Cors](https://www.npmjs.com/package/cors).
- [DotENV](https://www.npmjs.com/package/dotenv).
- [Express Validator](https://express-validator.github.io/docs).
- [Morgan](https://www.npmjs.com/package/morgan).
- [Nodemon](https://www.npmjs.com/package/nodemon).

# Tutorial Github

## How to Cloning Repository

1. Pada Komputer Anda Buka Console / Command Promt

2. Ketikan Perintah Berikut

```
git clone https://github.com/milhamap/sekawan-media-challange.git
```

3. Masuk Ke Dalam Folder Hasil Clone

```
cd sekawan-media-challange
```

# How to Use and Configuration Node JS Express

1. Install Node Package Manager Terlebih Dahulu <br>
   [Download disini](https://nodejs.org/en/download/)
2. Install all javascript dependecies Terlebih Dahulu

```
$ npm install
```

3. Copy isi file .env.example

```
cp .env.example .env
```

4. Edit pada .env 
```
PGUSER_DEV=USER_POSTGRESQL
PGPASSWORD_DEV=USER_PASSWORD
```

5. Buatlah database kosong di pg admin dengan nama **warehouse**
6. Lakukan Migrasi Database

```
$ knex migrate:latest
```

7. Lakukan seeder Database

```
$ knex seed:run
```

## How to Run

1. Run server using `npm` command below
```console
$ npm run start
```

## API Documentation

You can access this project API documentation [here](https://documenter.getpostman.com/view/21604420/2s93JqTkXi)