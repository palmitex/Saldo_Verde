import termos from '../../data/termos.js';

export default function Termos() {
    return (
        <>
            <main className="flex flex-col items-center mt-20">
                <h1 className="ml-5 text-4xl md:text-5xl font-extrabold text-gray-900">Confira nossos Termos e Política de Privacidade</h1>
                <div className="max-w-7xl mx-auto py-20 px-6 flex flex-col sm:flex-row gap-12 scroll-smooth">

                    {/* Navegação lateral */}
                    <aside className="hidden sm:flex flex-col w-72 text-sm gap-4 sticky top-30 self-start border border-gray-300 shadow-md rounded-2xl p-6 bg-white bg-gradient-to-b from-gray-200 to-gray-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Navegue pelos termos</h2>
                        {termos.map((termo) => (
                            <a
                                key={termo.id}
                                href={`#${termo.id}`}
                                className="text-green-700 hover:text-green-900 font-semibold transition-colors"
                            >
                                {termo.id}. {termo.titulo}
                            </a>
                        ))}
                    </aside>

                    {/* Conteúdo dos termos */}
                    <section className="flex flex-col gap-20 w-full">
                        {termos.map((termo) => (
                            <article
                                key={termo.id}
                                id={termo.id}
                                className="flex flex-col gap-6 scroll-mt-24 bg-gradient-to-r from-gray-200 to-gray-300 p-8 rounded-2xl shadow-lg hover:bg-gradient-to-l hover:shadow-xl border border-gray-300"
                            >
                                <header>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300">
                                        {termo.id}. {termo.titulo}
                                    </h3>
                                    <hr className="mt-2 border-gray-300" />
                                </header>
                                <p className="text-gray-700 text-lg">{termo.texto}</p>
                            </article>
                        ))}
                    </section>
                </div>
            </main>
        </>
    );
}
