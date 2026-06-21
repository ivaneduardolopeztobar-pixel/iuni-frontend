import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error capturado:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-black mb-4">
              <span className="text-red-600">i</span>UNI
            </h1>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8">
              <div className="w-16 h-16 bg-red-950 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl font-black">!</span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Algo salio mal</h2>
              <p className="text-gray-400 text-sm mb-6">
                Ocurrio un error inesperado. Por favor recarga la pagina o vuelve al inicio.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
                >
                  Recargar pagina
                </button>
                <button
                  onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
                  className="border border-gray-700 text-gray-300 hover:text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
                >
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
