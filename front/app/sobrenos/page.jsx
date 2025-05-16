import sobres from '../../data/sobre.js';

export default function Sobrenos() {
    return (
        <main className="flex flex-col items-center min-h-screen gap-16 px-4 sm:px-16 py-16">
            <div className="flex flex-col gap-24 w-full max-w-6xl">
                {sobres.map((sobre, index) => (
                    <div
                        key={sobre.id}
                        className={`flex flex-col sm:flex-row ${
                            index % 2 === 1 ? 'sm:flex-row-reverse' : ''
                        } items-center gap-8 sm:gap-16`}
                    >
                        {/* Espaço vazio */}
                        <div className="hidden sm:block w-1/2"></div>

                        {/* Texto */}
                        <div className="w-full sm:w-1/2 text-center sm:text-left px-4">
                            <h2 className="text-2xl font-bold mb-4 text-emerald-600">
                                {sobre.indice}. {sobre.titulo}
                            </h2>
                            <p className="text-gray-700 text-lg">{sobre.texto}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
