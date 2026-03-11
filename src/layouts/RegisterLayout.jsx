import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterLayout = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role_name: 'operator' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Ошибка регистрации');
            }

            alert('Регистрация успешна! Теперь войдите.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Логин"
                        className="w-full px-4 py-2 border rounded"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        className="w-full px-4 py-2 border rounded"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <select
                        className="w-full px-4 py-2 border rounded"
                        onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                    >
                        <option value="operator">Оператор</option>
                        <option value="admin">Администратор</option>
                    </select>
                    <button className="w-full bg-green-600 text-white py-2 rounded">Создать аккаунт</button>
                </form>
                <div className="mt-4 text-center">
                    <Link color="indigo" to="/login">Уже есть аккаунт? Войти</Link>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600 mb-2">Уже есть аккаунт?</p>
                    <Link
                        to="/login"
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                        Вернуться ко входу
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterLayout;