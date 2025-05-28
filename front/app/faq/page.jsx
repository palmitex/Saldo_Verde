import faqs from '../../data/faq.js'

export default function Faq() {

    return (
        <>
            <main className="max-w-7xl mx-auto mt-50 mb-50 flex flex-col gap-10 items-center">
                <h1 className="text-5xl font-bold">Perguntas Frequentemente Feitas</h1>
                <section>
                    <div className="border shadow-xl rounded-xl p-10 flex flex-col gap-10 max-w-3xl">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="flex flex-col gap-4"
                            >
                                <h2 className="text-2xl font-bold text-yellow-300">{faq.titulo}</h2>
                                <hr className="opacity-20" />
                                <p className="text-lg">{faq.texto}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}