import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'Óscar',
        email: 'oscar@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password123', 10)
    }
]

export default usuarios;