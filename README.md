# Sarai Dash

Goals & Mission: 

Project 'Sarai Dash' is a web app designed to streamlined time-in-time-out without employees leaving their seat, made compact and convenient.
Made available in major platforms, with QR code and photo tracking features.

Now specializing in Document Tracking System (DTS), made compact.

//Gawin niyong enhanced toh, dapat yung polished code na para bukas
// Form State
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('SARAI Research');
  const [actionType, setActionType] = useState('Sign In'); // 'Sign In' or 'Sign Out'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
