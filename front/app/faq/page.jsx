import faqs from '../../data/faq.js'

export default function Faq() {

    return (
        <>
            <main className="max-w-7xl mx-auto mt-20 mb-50 flex flex-col gap-10 items-center">
                <h1 className="ml-12 sm:ml-0 text-5xl font-bold">Perguntas Frequentemente Feitas</h1>
                <section>
                    <div className="border border-gray-300 shadow-xl rounded-xl p-10 flex flex-col gap-10 max-w-6xl">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="flex flex-col gap-4 border border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300 p-8 rounded-2xl shadow-lg hover:bg-gradient-to-l hover:shadow-xl"
                            >
                                <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300">{faq.titulo}</h3>
                                <hr className="opacity-20" />
                                <p className="text-gray-700 text-lg">{faq.texto}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
