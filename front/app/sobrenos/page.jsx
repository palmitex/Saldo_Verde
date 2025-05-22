import sobres from '../../data/sobre.js';

export default function Sobrenos() {
    return (
        <>
            <div className="flex flex-col items-center min-h-screen gap-16 px-4 sm:px-16 py-16">
                <div className="max-w-7xl mx-auto h-auto flex flex-col gap-40 border border-emerald-700 rounded-lg p-16 bg-gradient-to-tr from-emerald-900 to-green-500">
                    {sobres.map((sobre, index) => (
                        <div
                            key={sobre.id}
                            className={`flex flex-col sm:flex-row ${index % 2 === 1 ? 'sm:flex-row-reverse' : ''
                                } items-center h-auto`} 
                        >
                            {/* Espaço vazio */}
                            
                            <div className="hidden sm:flex justify-center w-1/2"><img src={sobre.img} alt="" className="hidden sm:block w-70" /></div>

                            {/* Texto */}
                            <div className="flex flex-col justify-around w-full sm:w-1/2 h-auto sm:h-full text-center sm:text-left px-4 border border-green-300 rounded-lg p-6 bg-gradient-to-br from-green-500 to-emerald-900">
                                <h2 className="text-3xl text-yellow-300 font-bold mb-4 border-b pb-3">
                                    {sobre.indice}. {sobre.titulo}
                                </h2>
                                <p className="text-white text-md ">{sobre.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
