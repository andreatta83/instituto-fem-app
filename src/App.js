import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Calendar, DollarSign, Package, ClipboardList, TrendingUp, Home, PlusCircle, Users, Box, Settings, ClipboardPlus, CheckCircle, XCircle, Search, Edit, Trash2, ChevronLeft, ChevronRight, Eye, Loader2, LogOut, Mail, Lock, ClipboardPen, ClipboardCheck, Printer, FileDown } from 'lucide-react';

// --- Importações do Firebase ---
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// --- Configuração e Inicialização do Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyACIDCLxXBn9_An-QsK8ddemgujl4LCvto",
    authDomain: "instituto-fem.firebaseapp.com",
    projectId: "instituto-fem",
    storageBucket: "instituto-fem.appspot.com",
    messagingSenderId: "862383084878",
    appId: "1:862383084878:web:55c41fb128574e1d13fa1f",
    measurementId: "G-ZJ9KCNG0ST"
};

let app;
let db;
let auth;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
}


// --- COMPONENTES DA UI ---

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center transform hover:scale-105 transition-transform duration-300">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <p className="text-md text-gray-500 mt-1">{subtitle}</p>
    </div>
);

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl leading-none">&times;</button>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const LoadingOverlay = ({ text = "Carregando..." }) => (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-40">
        <Loader2 className="animate-spin text-purple-600" size={48} />
        <p className="mt-4 text-lg text-purple-800">{text}</p>
    </div>
);

// --- TELA DE LOGIN ---
const LoginScreen = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        setIsLoading(true);
        setError('');
        try {
            if (isLoginMode) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/invalid-credential':
                    setError('E-mail ou senha inválidos.');
                    break;
                case 'auth/wrong-password':
                    setError('Senha incorreta.');
                    break;
                case 'auth/email-already-in-use':
                    setError('Este e-mail já está em uso.');
                    break;
                case 'auth/weak-password':
                    setError('A senha deve ter pelo menos 6 caracteres.');
                    break;
                default:
                    setError('Ocorreu um erro. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="w-full max-w-md mx-auto bg-white p-10 rounded-2xl shadow-2xl">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center mb-4">
                         <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-2 rounded-lg">
                           <Settings className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 ml-3">Instituto FEM</h1>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{isLoginMode ? 'Acessar o Sistema' : 'Criar Nova Conta'}</h2>
                </div>
                
                <form onSubmit={handleAuthAction}>
                    <div className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        </div>
                    </div>

                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                    <button type="submit" disabled={isLoading} className="mt-8 w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors text-lg flex items-center justify-center disabled:bg-purple-400">
                        {isLoading && <Loader2 className="animate-spin mr-2" />}
                        {isLoginMode ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    {isLoginMode ? 'Não tem uma conta?' : 'Já possui uma conta?'}
                    <button onClick={() => setIsLoginMode(!isLoginMode)} className="ml-2 font-semibold text-purple-600 hover:underline">
                        {isLoginMode ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- PÁGINAS DA APLICAÇÃO ---

const Dashboard = ({ clients, appointments, financials, inventory, services, setActiveTab, openNewAppointmentModal }) => {
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments
        .filter(a => a.date && a.date.startsWith(today))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const revenueToday = financials
        .filter(f => f.type === 'Entrada' && f.date === today)
        .reduce((sum, item) => sum + item.amount, 0);

    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

    const monthlyRevenueData = useMemo(() => {
        const data = {};
        financials.forEach(f => {
            if (f.type === 'Entrada') {
                const month = new Date(f.date).toLocaleString('pt-BR', { month: 'short' });
                data[month] = (data[month] || 0) + f.amount;
            }
        });
        return Object.keys(data).map(month => ({ name: month, Faturamento: data[month] }));
    }, [financials]);

    const topServicesData = useMemo(() => {
        const serviceCount = {};
        appointments.forEach(app => {
            const service = services.find(s => s.id === app.serviceId);
            if (service) {
                serviceCount[service.name] = (serviceCount[service.name] || 0) + 1;
            }
        });
        return Object.keys(serviceCount).map(name => ({ name, value: serviceCount[name] }));
    }, [appointments, services]);

    const COLORS = ['#fecdd3', '#e9d5ff', '#bfdbfe', '#fde68a', '#a7f3d0'];

    return (
        <div>
            <SectionTitle title="Dashboard" subtitle="Visão geral da sua clínica em tempo real." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Faturamento Hoje" value={`R$ ${revenueToday.toFixed(2)}`} icon={<DollarSign className="text-green-600" />} color="bg-green-100" />
                <StatCard title="Agendamentos Hoje" value={upcomingAppointments.length} icon={<Calendar className="text-blue-600" />} color="bg-blue-100" />
                <StatCard title="Total de Clientes" value={clients.length} icon={<User className="text-purple-600" />} color="bg-purple-100" />
                <StatCard title="Estoque Baixo" value={lowStockItems.length} icon={<Package className="text-red-600" />} color="bg-red-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Faturamento Mensal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `R$${value}`} />
                            <Tooltip formatter={(value) => `R$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="Faturamento" fill="#c084fc" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Serviços Mais Populares</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={topServicesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                {topServicesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Próximos Agendamentos (Hoje)</h3>
                    <div className="space-y-4">
                        {upcomingAppointments.length > 0 ? upcomingAppointments.map(app => {
                            const client = clients.find(c => c.id === app.clientId);
                            const service = services.find(s => s.id === app.serviceId);
                            return (
                                <div key={app.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800">{client?.name}</p>
                                        <p className="text-sm text-gray-600">{service?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-purple-700">{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <span className={`px-2 py-1 text-xs rounded-full ${app.status === 'Agendado' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{app.status}</span>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-gray-500">Nenhum agendamento para hoje.</p>}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Ações Rápidas</h3>
                    <div className="space-y-3">
                         <button onClick={openNewAppointmentModal} className="w-full text-left flex items-center p-4 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors">
                            <PlusCircle className="mr-3 text-purple-600" /> Novo Agendamento
                        </button>
                        <button onClick={() => setActiveTab('Clientes')} className="w-full text-left flex items-center p-4 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors">
                            <User className="mr-3 text-purple-600" /> Nova Cliente
                        </button>
                        <button onClick={() => setActiveTab('Financeiro')} className="w-full text-left flex items-center p-4 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors">
                            <DollarSign className="mr-3 text-purple-600" /> Registrar Venda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Agenda = ({ appointments, clients, services, isModalOpen, setIsModalOpen, db, userId }) => {
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleSaveAppointment = async (appointmentData) => {
        const collectionPath = `users/${userId}/appointments`;
        if (editingAppointment) {
            const docRef = doc(db, collectionPath, editingAppointment.id);
            await updateDoc(docRef, appointmentData);
        } else {
            await addDoc(collection(db, collectionPath), appointmentData);
        }
        closeModal();
    };

    const openEditModal = (appointment) => {
        setEditingAppointment(appointment);
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingAppointment(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAppointment(null);
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmado': return 'border-green-400 bg-green-50';
            case 'Realizado': return 'border-purple-400 bg-purple-50';
            case 'Cancelado': return 'border-red-400 bg-red-50';
            case 'Agendado':
            default:
                return 'border-blue-400 bg-blue-50';
        }
    };
    
    const getStatusTextClass = (status) => {
        switch (status) {
            case 'Confirmado': return 'bg-green-200 text-green-800';
            case 'Realizado': return 'bg-purple-200 text-purple-800';
            case 'Cancelado': return 'bg-red-200 text-red-800';
            case 'Agendado':
            default:
                return 'bg-blue-200 text-blue-800';
        }
    };

    const AppointmentForm = ({ initialData, onSave, preselectedDate }) => {
        const getInitialDate = useCallback(() => {
            if (initialData?.date) return initialData.date.slice(0, 16);
            if (preselectedDate) {
                const year = preselectedDate.getFullYear();
                const month = (preselectedDate.getMonth() + 1).toString().padStart(2, '0');
                const day = preselectedDate.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}T09:00`;
            }
            return '';
        }, [initialData, preselectedDate]);

        const [appointmentData, setAppointmentData] = useState(initialData || { 
            clientId: '', 
            serviceId: '', 
            date: getInitialDate(), 
            status: 'Agendado' 
        });

        useEffect(() => {
            setAppointmentData(initialData || { 
                clientId: '', 
                serviceId: '', 
                date: getInitialDate(), 
                status: 'Agendado' 
            });
        }, [initialData, preselectedDate, getInitialDate]);

        return (
            <div className="space-y-4">
                <select value={appointmentData.clientId} onChange={(e) => setAppointmentData({...appointmentData, clientId: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="">Selecione a Cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={appointmentData.serviceId} onChange={(e) => setAppointmentData({...appointmentData, serviceId: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="">Selecione o Serviço</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="datetime-local" value={appointmentData.date} onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <select value={appointmentData.status} onChange={(e) => setAppointmentData({...appointmentData, status: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="Agendado">Agendado</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Realizado">Realizado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <button onClick={() => onSave(appointmentData)} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                    Salvar Agendamento
                </button>
            </div>
        );
    };

    const MonthlyCalendar = ({ onDateClick }) => {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const appointmentsInMonth = useMemo(() => {
            const dates = new Set();
            appointments.forEach(app => {
                const appDate = new Date(app.date);
                if (appDate.getFullYear() === year && appDate.getMonth() === month) {
                    dates.add(appDate.getDate());
                }
            });
            return dates;
        }, [appointments, year, month]);

        const changeMonth = (offset) => {
            setCurrentDate(new Date(year, month + offset, 1));
        };

        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isSelected = selectedDate.toDateString() === new Date(year, month, day).toDateString();
            const hasAppointment = appointmentsInMonth.has(day);
            calendarDays.push(
                <div key={day} className="p-2 text-center relative cursor-pointer" onClick={() => onDateClick(new Date(year, month, day))}>
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-pink-300' : ''} ${isToday ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-pink-100'}`}>
                        {day}
                    </span>
                    {hasAppointment && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
            );
        }

        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
                    <h3 className="text-xl font-bold text-gray-800">{monthNames[month]} {year}</h3>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map(day => <div key={day} className="font-bold text-center text-gray-500">{day}</div>)}
                    {calendarDays}
                </div>
            </div>
        );
    };
    
    const filteredAppointments = appointments.filter(app => new Date(app.date).toDateString() === selectedDate.toDateString());

    return (
        <div>
            <SectionTitle title="Agenda" subtitle="Gerencie seus horários e agendamentos." />
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <MonthlyCalendar onDateClick={setSelectedDate} />
                <div className="flex justify-between items-center mb-6 border-t pt-6 mt-6">
                    <h2 className="text-2xl font-bold text-gray-700">Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}</h2>
                    <button onClick={openNewModal} className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                        <PlusCircle className="mr-2" /> Novo Agendamento
                    </button>
                </div>
                <div className="space-y-4">
                    {filteredAppointments.length > 0 ? filteredAppointments.sort((a,b) => new Date(a.date) - new Date(b.date)).map(app => {
                        const client = clients.find(c => c.id === app.clientId);
                        const service = services.find(s => s.id === app.serviceId);
                        return (
                             <div key={app.id} className={`p-4 border-l-4 ${getStatusClass(app.status)} rounded-r-lg flex justify-between items-center`}>
                                <div>
                                    <p className="font-bold text-lg text-purple-900">{client?.name || 'Cliente não encontrado'}</p>
                                    <p className="text-gray-600">{service?.name || 'Serviço não encontrado'}</p>
                                    <p className="font-semibold text-gray-800 mt-1">{new Date(app.date).toLocaleString('pt-BR', { timeStyle: 'short' })}</p>
                                </div>
                                <div className="text-right flex items-center">
                                    <span className={`mr-4 inline-block px-3 py-1 text-sm rounded-full ${getStatusTextClass(app.status)}`}>{app.status}</span>
                                    <button onClick={() => openEditModal(app)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full"><Edit size={18} /></button>
                                </div>
                            </div>
                        )
                    }) : <p className="text-gray-500 text-center py-4">Nenhum agendamento para esta data.</p>}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}>
                <AppointmentForm initialData={editingAppointment} onSave={handleSaveAppointment} preselectedDate={selectedDate} />
            </Modal>
        </div>
    );
};

const Clientes = ({ clients, appointments, services, userId, db }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [viewingClient, setViewingClient] = useState(null);
    const [deletingClientId, setDeletingClientId] = useState(null);
    const [clientForm, setClientForm] = useState({ name: '', phone: '', cpf: '', email: '', nascimento: '', observacoes: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const openFormModal = (client = null) => {
        setEditingClient(client);
        setClientForm(client || { name: '', phone: '', cpf: '', email: '', nascimento: '', observacoes: '' });
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingClient(null);
    };

    const handleSaveClient = async () => {
        const collectionPath = `users/${userId}/clients`;
        if (editingClient) {
            const docRef = doc(db, collectionPath, editingClient.id);
            await updateDoc(docRef, clientForm);
        } else {
            await addDoc(collection(db, collectionPath), clientForm);
        }
        closeFormModal();
    };

    const openDeleteModal = (id) => {
        setDeletingClientId(id);
        setIsDeleteModalOpen(true);
    };
    
    const openViewModal = (client) => {
        setViewingClient(client);
        setIsViewModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingClientId(null);
    };
    
    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setViewingClient(null);
    };

    const handleDeleteClient = async () => {
        const collectionPath = `users/${userId}/clients`;
        const docRef = doc(db, collectionPath, deletingClientId);
        await deleteDoc(docRef);
        closeDeleteModal();
    };
    
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.cpf && client.cpf.includes(searchTerm))
    );

    const getLastVisit = (clientId) => {
        const realizedAppointments = appointments
            .filter(app => app.clientId === clientId && app.status === 'Realizado')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return realizedAppointments.length > 0 ? new Date(realizedAppointments[0].date).toLocaleDateString('pt-BR') : 'Nenhuma';
    };
    
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        // Corrige o problema de fuso horário adicionando T00:00:00
        const date = new Date(`${dateString}T00:00:00`);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div>
            <SectionTitle title="Clientes" subtitle="Gerencie sua base de clientes e seus históricos." />
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-700">Lista de Clientes</h2>
                    <button onClick={() => openFormModal()} className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                        <PlusCircle className="mr-2" /> Adicionar Cliente
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Nome</th>
                                <th className="p-4 font-semibold text-gray-600">CPF</th>
                                <th className="p-4 font-semibold text-gray-600">Telefone</th>
                                <th className="p-4 font-semibold text-gray-600">Última Visita</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id} className="border-b border-gray-100 hover:bg-pink-50">
                                    <td className="p-4 font-semibold text-gray-800">{client.name}</td>
                                    <td className="p-4 text-gray-600">{client.cpf}</td>
                                    <td className="p-4 text-gray-600">{client.phone}</td>
                                    <td className="p-4 text-gray-600">{getLastVisit(client.id)}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openViewModal(client)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"><Eye size={18} /></button>
                                        <button onClick={() => openFormModal(client)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full ml-2"><Edit size={18} /></button>
                                        <button onClick={() => openDeleteModal(client.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full ml-2"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal para Adicionar/Editar Cliente */}
            <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={editingClient ? "Editar Cliente" : "Nova Cliente"}>
                <div className="space-y-4">
                    <input type="text" placeholder="Nome Completo" value={clientForm.name} onChange={(e) => setClientForm({...clientForm, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="text" placeholder="CPF" value={clientForm.cpf} onChange={(e) => setClientForm({...clientForm, cpf: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="text" placeholder="Telefone" value={clientForm.phone} onChange={(e) => setClientForm({...clientForm, phone: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="email" placeholder="E-mail" value={clientForm.email} onChange={(e) => setClientForm({...clientForm, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="date" placeholder="Data de Nascimento" value={clientForm.nascimento} onChange={(e) => setClientForm({...clientForm, nascimento: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <textarea placeholder="Observações" value={clientForm.observacoes} onChange={(e) => setClientForm({...clientForm, observacoes: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" rows="3"></textarea>
                    <button onClick={handleSaveClient} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Salvar
                    </button>
                </div>
            </Modal>
            {/* Modal para Visualizar Cliente */}
            <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Ficha da Cliente">
                {viewingClient && (
                    <div>
                        <div className="space-y-2 mb-6">
                            <div className="p-3 rounded-lg bg-gray-50"><strong className="text-gray-600 w-32 inline-block">Nome:</strong> <span className="text-gray-800">{viewingClient.name}</span></div>
                            <div className="p-3 rounded-lg bg-gray-50"><strong className="text-gray-600 w-32 inline-block">CPF:</strong> <span className="text-gray-800">{viewingClient.cpf}</span></div>
                            <div className="p-3 rounded-lg bg-gray-50"><strong className="text-gray-600 w-32 inline-block">Telefone:</strong> <span className="text-gray-800">{viewingClient.phone}</span></div>
                            <div className="p-3 rounded-lg bg-gray-50"><strong className="text-gray-600 w-32 inline-block">Email:</strong> <span className="text-gray-800">{viewingClient.email}</span></div>
                            <div className="p-3 rounded-lg bg-gray-50"><strong className="text-gray-600 w-32 inline-block">Nascimento:</strong> <span className="text-gray-800">{formatDisplayDate(viewingClient.nascimento)}</span></div>
                            <div className="p-3 rounded-lg bg-gray-50"><strong className="text-gray-600 block mb-1">Observações:</strong> <p className="text-gray-800">{viewingClient.observacoes || 'Nenhuma observação.'}</p></div>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Histórico de Procedimentos</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {appointments.filter(a => a.clientId === viewingClient.id && a.status === 'Realizado').length > 0 ? 
                                    appointments.filter(a => a.clientId === viewingClient.id && a.status === 'Realizado')
                                    .sort((a,b) => new Date(b.date) - new Date(a.date))
                                    .map(app => {
                                        const service = services.find(s => s.id === app.serviceId);
                                        return (
                                            <div key={app.id} className="p-3 bg-purple-50 rounded-lg flex justify-between">
                                                <span className="font-semibold text-purple-800">{service?.name || 'Serviço desconhecido'}</span>
                                                <span className="text-gray-600">{new Date(app.date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        )
                                    }) : <p className="text-gray-500">Nenhum procedimento realizado.</p>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            {/* Modal para Confirmar Exclusão */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Exclusão">
                <p>Você tem certeza que deseja excluir esta cliente? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={closeDeleteModal} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button onClick={handleDeleteClient} className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700">Excluir</button>
                </div>
            </Modal>
        </div>
    );
};

const AnamneseClinica = ({ clients, anamneseForms, userId, db }) => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
    const [currentAnamnese, setCurrentAnamnese] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const initialFormState = useMemo(() => ({
        queixa_principal: '', procedimentos_anteriores: '', reacao_adversa: '',
        doenca_preexistente: '', alergia: '', medicamento_continuo: '',
        gestante_lactante: 'Não', marcapasso_protese: 'Não', rotina_skincare: '',
        fumante: 'Não', protetor_solar: 'Não'
    }), []);

    const handleSave = async () => {
        const collectionPath = `users/${userId}/anamneseForms`;
        if (currentAnamnese.id) { // Editando uma existente
            const docRef = doc(db, collectionPath, currentAnamnese.id);
            await updateDoc(docRef, currentAnamnese);
        } else { // Criando uma nova
            const dataToSave = {
                ...currentAnamnese,
                clientId: selectedClient.id,
                createdAt: new Date().toISOString()
            };
            await addDoc(collection(db, collectionPath), dataToSave);
        }
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        setViewMode('list');
        setIsEditing(false);
        setCurrentAnamnese(null);
    };
    
    const filteredClients = searchTerm ? clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.cpf && client.cpf.includes(searchTerm))
    ) : [];

    const selectClient = (client) => {
        setSelectedClient(client);
        setSearchTerm('');
        setViewMode('list');
    };
    
    const clientAnamneses = useMemo(() => {
        if (!selectedClient) return [];
        return anamneseForms
            .filter(form => form.clientId === selectedClient.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [selectedClient, anamneseForms]);

    const RadioGroup = ({ label, name, value, onChange, disabled }) => (
        <div className="flex items-center space-x-4">
            <span className="text-gray-700">{label}</span>
            <label className="flex items-center cursor-pointer">
                <input type="radio" name={name} value="Sim" checked={value === 'Sim'} onChange={onChange} disabled={disabled} className="form-radio text-purple-600 h-4 w-4" />
                <span className="ml-2">Sim</span>
            </label>
            <label className="flex items-center cursor-pointer">
                <input type="radio" name={name} value="Não" checked={value === 'Não'} onChange={onChange} disabled={disabled} className="form-radio text-purple-600 h-4 w-4" />
                <span className="ml-2">Não</span>
            </label>
        </div>
    );
    
    return (
        <div>
            <SectionTitle title="Anamnese Clínica" subtitle="Gerencie o histórico de anamneses das suas clientes." />
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                {!selectedClient ? (
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Buscar Cliente</label>
                        <div className="relative">
                            <input type="text" placeholder="Digite o nome ou CPF da cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        {filteredClients.length > 0 && (
                            <ul className="mt-2 border border-gray-200 rounded-lg bg-white max-h-60 overflow-y-auto">
                                {filteredClients.map(client => (
                                    <li key={client.id} onClick={() => selectClient(client)} className="p-3 hover:bg-pink-50 cursor-pointer border-b last:border-b-0">
                                        {client.name} - {client.cpf}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="mb-6 p-4 bg-purple-50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-purple-900">{selectedClient.name}</p>
                                <p className="text-sm text-gray-600">{selectedClient.cpf}</p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="text-sm text-purple-600 hover:underline">Trocar Cliente</button>
                        </div>

                        {showSuccessMessage && (<div className="mb-4 p-4 bg-green-100 text-green-800 border-l-4 border-green-500 rounded-r-lg flex items-center"><CheckCircle className="mr-3" />Ficha de anamnese salva com sucesso!</div>)}

                        {viewMode === 'list' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-gray-700">Histórico de Anamneses</h3>
                                    <button onClick={() => { setCurrentAnamnese(initialFormState); setViewMode('form'); setIsEditing(true); }} className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                                        <PlusCircle className="mr-2" /> Nova Anamnese
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {clientAnamneses.length > 0 ? clientAnamneses.map(form => (
                                        <div key={form.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-800">{new Date(form.createdAt).toLocaleDateString('pt-BR')}</p>
                                                <p className="text-sm text-gray-600 truncate">Queixa: {form.queixa_principal || 'Não informada'}</p>
                                            </div>
                                            <button onClick={() => { setCurrentAnamnese(form); setViewMode('form'); setIsEditing(false); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"><Eye size={18} /></button>
                                        </div>
                                    )) : <p className="text-gray-500 text-center py-4">Nenhuma ficha de anamnese encontrada para esta cliente.</p>}
                                </div>
                            </div>
                        )}

                        {viewMode === 'form' && currentAnamnese && (
                             <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center">
                                    <button onClick={() => setViewMode('list')} className="text-purple-600 hover:underline">← Voltar para o histórico</button>
                                    {!isEditing && (
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => alert('Exportar PDF: Funcionalidade em desenvolvimento.')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"><FileDown size={18} /></button>
                                            <button onClick={() => alert('Imprimir: Funcionalidade em desenvolvimento.')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"><Printer size={18} /></button>
                                            <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full"><Edit size={18} /></button>
                                        </div>
                                    )}
                                </div>
                                <fieldset disabled={!isEditing} className="disabled:opacity-70">
                                    <fieldset className="border border-gray-200 p-6 rounded-lg"><legend className="text-xl font-bold text-purple-800 px-2">Queixa Principal e Histórico Estético</legend><div className="space-y-4 mt-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Qual a sua principal queixa ou objetivo do tratamento?</label><textarea name="queixa_principal" value={currentAnamnese.queixa_principal || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, queixa_principal: e.target.value})} rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400"></textarea></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Já realizou algum procedimento estético anteriormente? Quais e quando?</label><textarea name="procedimentos_anteriores" value={currentAnamnese.procedimentos_anteriores || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, procedimentos_anteriores: e.target.value})} rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400"></textarea></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Teve alguma reação adversa ou complicação?</label><textarea name="reacao_adversa" value={currentAnamnese.reacao_adversa || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, reacao_adversa: e.target.value})} rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400"></textarea></div></div></fieldset>
                                    <fieldset className="border border-gray-200 p-6 rounded-lg mt-8"><legend className="text-xl font-bold text-purple-800 px-2">Histórico de Saúde</legend><div className="space-y-4 mt-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Possui alguma doença pré-existente (diabetes, hipertensão, etc)?</label><input type="text" name="doenca_preexistente" value={currentAnamnese.doenca_preexistente || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, doenca_preexistente: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Possui alguma alergia?</label><input type="text" name="alergia" value={currentAnamnese.alergia || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, alergia: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Faz uso de algum medicamento contínuo? Quais?</label><input type="text" name="medicamento_continuo" value={currentAnamnese.medicamento_continuo || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, medicamento_continuo: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400" /></div><RadioGroup label="É gestante ou está amamentando?" name="gestante_lactante" value={currentAnamnese.gestante_lactante || 'Não'} onChange={(e) => setCurrentAnamnese({...currentAnamnese, gestante_lactante: e.target.value})} disabled={!isEditing} /><RadioGroup label="Possui marca-passo ou prótese metálica?" name="marcapasso_protese" value={currentAnamnese.marcapasso_protese || 'Não'} onChange={(e) => setCurrentAnamnese({...currentAnamnese, marcapasso_protese: e.target.value})} disabled={!isEditing} /></div></fieldset>
                                    <fieldset className="border border-gray-200 p-6 rounded-lg mt-8"><legend className="text-xl font-bold text-purple-800 px-2">Hábitos e Cuidados com a Pele</legend><div className="space-y-4 mt-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Qual sua rotina de cuidados com a pele (skincare)?</label><textarea name="rotina_skincare" value={currentAnamnese.rotina_skincare || ''} onChange={(e) => setCurrentAnamnese({...currentAnamnese, rotina_skincare: e.target.value})} rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-400 focus:border-purple-400"></textarea></div><RadioGroup label="É fumante?" name="fumante" value={currentAnamnese.fumante || 'Não'} onChange={(e) => setCurrentAnamnese({...currentAnamnese, fumante: e.target.value})} disabled={!isEditing} /><RadioGroup label="Usa protetor solar diariamente?" name="protetor_solar" value={currentAnamnese.protetor_solar || 'Não'} onChange={(e) => setCurrentAnamnese({...currentAnamnese, protetor_solar: e.target.value})} disabled={!isEditing} /></div></fieldset>
                                </fieldset>
                                {isEditing && <button onClick={handleSave} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-md mt-8">Salvar Alterações</button>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Estoque = ({ inventory, userId, db }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', quantity: '', minStock: '', supplier: '' });

    const openModal = (product = null) => {
        setEditingProduct(product);
        setProductForm(product || { name: '', quantity: '', minStock: '', supplier: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSave = async () => {
        const collectionPath = `users/${userId}/inventory`;
        const processedForm = { ...productForm, quantity: parseInt(productForm.quantity) || 0, minStock: parseInt(productForm.minStock) || 0 };
        if (editingProduct) {
            const docRef = doc(db, collectionPath, editingProduct.id);
            await updateDoc(docRef, processedForm);
        } else {
            await addDoc(collection(db, collectionPath), processedForm);
        }
        closeModal();
    };

    return (
         <div>
            <SectionTitle title="Estoque" subtitle="Controle seus produtos e materiais." />
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-700">Inventário de Produtos</h2>
                    <button onClick={() => openModal()} className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                        <PlusCircle className="mr-2" /> Adicionar Produto
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Produto</th>
                                <th className="p-4 font-semibold text-gray-600">Quantidade</th>
                                <th className="p-4 font-semibold text-gray-600">Estoque Mínimo</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => {
                                const isLow = item.quantity <= item.minStock;
                                return (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-pink-50">
                                        <td className="p-4 font-semibold text-gray-800">{item.name}</td>
                                        <td className="p-4 text-gray-600">{item.quantity}</td>
                                        <td className="p-4 text-gray-600">{item.minStock}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-sm rounded-full ${isLow ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                {isLow ? 'Baixo' : 'OK'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full"><Edit size={18} /></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? "Editar Produto" : "Adicionar Produto"}>
                <div className="space-y-4">
                    <input type="text" placeholder="Nome do Produto" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="number" placeholder="Quantidade" value={productForm.quantity} onChange={(e) => setProductForm({...productForm, quantity: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="number" placeholder="Estoque Mínimo" value={productForm.minStock} onChange={(e) => setProductForm({...productForm, minStock: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="text" placeholder="Fornecedor" value={productForm.supplier} onChange={(e) => setProductForm({...productForm, supplier: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <button onClick={handleSave} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Salvar Produto
                    </button>
                </div>
            </Modal>
        </div>
    )
};

const Financeiro = ({ financials, userId, db }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [transactionForm, setTransactionForm] = useState({ type: 'Entrada', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });

    const openModal = (transaction = null) => {
        setEditingTransaction(transaction);
        setTransactionForm(transaction ? { ...transaction, amount: String(transaction.amount) } : { type: 'Entrada', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSave = async () => {
        const collectionPath = `users/${userId}/financials`;
        const processedForm = { ...transactionForm, amount: parseFloat(transactionForm.amount) };
        if (editingTransaction) {
            const docRef = doc(db, collectionPath, editingTransaction.id);
            await updateDoc(docRef, processedForm);
        } else {
            await addDoc(collection(db, collectionPath), processedForm);
        }
        closeModal();
    };

    const totalEntradas = financials.filter(f => f.type === 'Entrada').reduce((sum, item) => sum + item.amount, 0);
    const totalSaidas = financials.filter(f => f.type === 'Saída').reduce((sum, item) => sum + item.amount, 0);
    const saldo = totalEntradas - totalSaidas;

    return (
         <div>
            <SectionTitle title="Financeiro" subtitle="Acompanhe o fluxo de caixa da sua clínica." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-100 p-6 rounded-2xl shadow-md"><p className="text-sm text-green-800">Total de Entradas</p><p className="text-2xl font-bold text-green-900">R$ {totalEntradas.toFixed(2)}</p></div>
                <div className="bg-red-100 p-6 rounded-2xl shadow-md"><p className="text-sm text-red-800">Total de Saídas</p><p className="text-2xl font-bold text-red-900">R$ {totalSaidas.toFixed(2)}</p></div>
                <div className={`${saldo >= 0 ? 'bg-blue-100' : 'bg-orange-100'} p-6 rounded-2xl shadow-md`}><p className={`text-sm ${saldo >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Saldo Atual</p><p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>R$ {saldo.toFixed(2)}</p></div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-700">Extrato de Transações</h2>
                    <button onClick={() => openModal()} className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                        <PlusCircle className="mr-2" /> Nova Transação
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b-2 border-gray-100"><th className="p-4 font-semibold text-gray-600">Data</th><th className="p-4 font-semibold text-gray-600">Descrição</th><th className="p-4 font-semibold text-gray-600">Tipo</th><th className="p-4 font-semibold text-gray-600 text-right">Valor</th><th className="p-4 font-semibold text-gray-600">Ações</th></tr></thead>
                        <tbody>
                            {financials.sort((a,b) => new Date(b.date) - new Date(a.date)).map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-4 text-gray-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 font-semibold text-gray-800">{item.description}</td>
                                    <td className="p-4"><span className={`font-semibold ${item.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>{item.type}</span></td>
                                    <td className={`p-4 font-bold text-right ${item.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>R$ {item.amount.toFixed(2)}</td>
                                    <td className="p-4"><button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full"><Edit size={18} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTransaction ? "Editar Transação" : "Nova Transação"}>
                <div className="space-y-4">
                    <select value={transactionForm.type} onChange={(e) => setTransactionForm({...transactionForm, type: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"><option value="Entrada">Entrada</option><option value="Saída">Saída</option></select>
                    <input type="text" placeholder="Descrição" value={transactionForm.description} onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="number" placeholder="Valor (R$)" value={transactionForm.amount} onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="date" value={transactionForm.date} onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <button onClick={handleSave} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">Salvar Transação</button>
                </div>
            </Modal>
        </div>
    )
};

const Servicos = ({ services, userId, db }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '' });

    const openModal = (service = null) => {
        setEditingService(service);
        setServiceForm(service ? { ...service, price: String(service.price), duration: String(service.duration) } : { name: '', price: '', duration: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleSave = async () => {
        const collectionPath = `users/${userId}/services`;
        const processedForm = { ...serviceForm, price: parseFloat(serviceForm.price), duration: parseInt(serviceForm.duration) };
        if (editingService) {
            const docRef = doc(db, collectionPath, editingService.id);
            await updateDoc(docRef, processedForm);
        } else {
            await addDoc(collection(db, collectionPath), processedForm);
        }
        closeModal();
    };

    return (
        <div>
            <SectionTitle title="Serviços" subtitle="Cadastre os procedimentos oferecidos pela clínica." />
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-700">Lista de Serviços</h2>
                    <button onClick={() => openModal()} className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                        <PlusCircle className="mr-2" /> Novo Serviço
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-pink-50 p-6 rounded-xl border-l-4 border-pink-300 relative group">
                            <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                            <p className="text-2xl font-bold text-purple-700 my-2">R$ {service.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">Duração: {service.duration} min</p>
                            <button onClick={() => openModal(service)} className="absolute top-4 right-4 p-2 bg-white text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Edit size={18} /></button>
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingService ? "Editar Serviço" : "Novo Serviço"}>
                <div className="space-y-4">
                    <input type="text" placeholder="Nome do Serviço" value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="number" placeholder="Preço (R$)" value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <input type="number" placeholder="Duração (minutos)" value={serviceForm.duration} onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <button onClick={handleSave} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Salvar Serviço
                    </button>
                </div>
            </Modal>
        </div>
    );
};

const Relatorios = () => {
     return (
        <div>
            <SectionTitle title="Relatórios" subtitle="Analise o desempenho e tome decisões estratégicas." />
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-700">Em Breve</h2>
                <p className="text-gray-500">Esta seção trará gráficos e análises detalhadas sobre faturamento, clientes mais recorrentes, performance de serviços e muito mais!</p>
                <TrendingUp className="mx-auto mt-8 text-purple-300" size={64} />
            </div>
        </div>
    );
}

const Receituario = () => {
    return (
        <div>
            <SectionTitle title="Receituário" subtitle="Emissão e gerenciamento de receituários médicos." />
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-700">Protótipo de Receituário</h2>
                <p className="text-gray-500">Esta área será desenvolvida para a criação, impressão e histórico de receituários médicos para as clientes.</p>
                <ClipboardPen className="mx-auto mt-8 text-purple-300" size={64} />
            </div>
        </div>
    );
}

const Atendimentos = () => {
    return (
        <div>
            <SectionTitle title="Atendimentos" subtitle="Registro de sessões e acompanhamento de tratamentos." />
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-700">Protótipo de Atendimentos</h2>
                <p className="text-gray-500">Esta área será desenvolvida para registrar cada atendimento, anotar observações da sessão e acompanhar a evolução do tratamento.</p>
                <ClipboardCheck className="mx-auto mt-8 text-purple-300" size={64} />
            </div>
        </div>
    );
}


// --- Componente Principal da Aplicação (Após Login) ---
const MainApp = ({ user, handleLogout }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para os dados do Firestore
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [financials, setFinancials] = useState([]);
    const [anamneseForms, setAnamneseForms] = useState([]);

    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    useEffect(() => {
        if (!user.uid) return;

        const collections = {
            clients: setClients,
            services: setServices,
            inventory: setInventory,
            appointments: setAppointments,
            financials: setFinancials,
            anamneseForms: setAnamneseForms,
        };

        const unsubscribes = Object.entries(collections).map(([name, setter]) => {
            const collectionPath = `users/${user.uid}/${name}`;
            return onSnapshot(collection(db, collectionPath), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(data);
            });
        });

        setIsLoading(false);
        return () => unsubscribes.forEach(unsub => unsub());
    }, [user.uid]);

    const openNewAppointmentModal = () => {
        setActiveTab('Agenda');
        setIsAppointmentModalOpen(true);
    };

    const renderContent = () => {
        if (isLoading) return <LoadingOverlay />;
        
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard clients={clients} appointments={appointments} financials={financials} inventory={inventory} services={services} setActiveTab={setActiveTab} openNewAppointmentModal={openNewAppointmentModal} />;
            case 'Agenda':
                return <Agenda appointments={appointments} clients={clients} services={services} isModalOpen={isAppointmentModalOpen} setIsModalOpen={setIsAppointmentModalOpen} userId={user.uid} db={db} />;
            case 'Clientes':
                return <Clientes clients={clients} appointments={appointments} services={services} userId={user.uid} db={db} />;
            case 'Anamnese':
                return <AnamneseClinica clients={clients} anamneseForms={anamneseForms} userId={user.uid} db={db} />;
            case 'Atendimentos':
                return <Atendimentos />;
            case 'Receituário':
                return <Receituario />;
            case 'Serviços':
                return <Servicos services={services} userId={user.uid} db={db} />;
            case 'Estoque':
                return <Estoque inventory={inventory} userId={user.uid} db={db} />;
            case 'Financeiro':
                return <Financeiro financials={financials} userId={user.uid} db={db} />;
            case 'Relatórios':
                return <Relatorios />;
            default:
                return <Dashboard />;
        }
    };

    const NavItem = ({ label, icon, tabName }) => (
        <li className="mb-2">
            <button
                onClick={() => setActiveTab(tabName)}
                className={`w-full flex items-center py-3 px-4 rounded-lg transition-colors text-left ${
                    activeTab === tabName
                        ? 'bg-white/50 text-purple-800 shadow-md'
                        : 'text-gray-600 hover:bg-white/50 hover:text-purple-800'
                }`}
            >
                {icon}
                <span className="ml-4 font-semibold">{label}</span>
            </button>
        </li>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 font-sans flex">
            <style>{`
                @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-in-out forwards; }
            `}</style>

            <aside className="w-64 bg-white/30 backdrop-blur-md p-6 flex-shrink-0 flex flex-col justify-between shadow-xl">
                <div>
                    <div className="flex items-center mb-12">
                        <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-2 rounded-lg">
                           <Settings className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 ml-3">Instituto FEM</h1>
                    </div>
                    <nav>
                        <ul>
                            <NavItem label="Dashboard" icon={<Home size={20} />} tabName="Dashboard" />
                            <NavItem label="Agenda" icon={<Calendar size={20} />} tabName="Agenda" />
                            <NavItem label="Clientes" icon={<Users size={20} />} tabName="Clientes" />
                            <NavItem label="Anamnese" icon={<ClipboardPlus size={20} />} tabName="Anamnese" />
                            <NavItem label="Atendimentos" icon={<ClipboardCheck size={20} />} tabName="Atendimentos" />
                            <NavItem label="Receituário" icon={<ClipboardPen size={20} />} tabName="Receituário" />
                            <NavItem label="Serviços" icon={<ClipboardList size={20} />} tabName="Serviços" />
                            <NavItem label="Estoque" icon={<Box size={20} />} tabName="Estoque" />
                            <NavItem label="Financeiro" icon={<DollarSign size={20} />} tabName="Financeiro" />
                            <NavItem label="Relatórios" icon={<TrendingUp size={20} />} tabName="Relatórios" />
                        </ul>
                    </nav>
                </div>
                 <div className="p-4 bg-white/30 rounded-lg text-center space-y-2">
                    <p className="text-sm text-purple-800 font-semibold truncate" title={user.email}>{user.email || 'Usuário'}</p>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                        <LogOut size={16} className="mr-2" /> Sair
                    </button>
                 </div>
            </aside>

            <main className="flex-1 p-10 overflow-auto relative">
                {renderContent()}
            </main>
        </div>
    );
}

// --- Componente de Controle de Autenticação ---
export default function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-pink-100">
                <LoadingOverlay text="Verificando autenticação..." />
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return <MainApp user={user} handleLogout={handleLogout} />;
}
