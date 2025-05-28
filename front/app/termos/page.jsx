import termos from '../../data/termos.js'

export default function Termos() {

    return (
        <>
            <main className="max-w-7xl mx-auto m-40 flex flex-col sm:flex-row gap-10">
                <div className="ml-2 sm:flex hidden flex-col text-sm gap-4 h-min border border-transparent shadow-inner rounded-xl p-6 bg-gray-300">
                    <h1 className="text-lg font-bold">Navegue pelos termos</h1>

                    <a href="#1" className="text-green-700 font-bold">1. Coleta de Dados Pessoais</a>
                    <a href="#2" className="text-green-700 font-bold">2. Uso das Informações</a>
                    <a href="#3" className="text-green-700 font-bold">3. Compartilhamento com Terceiros</a>
                    <a href="#4" className="text-green-700 font-bold">4. Dados de Navegação</a>
                    <a href="#5" className="text-green-700 font-bold">5. Segurança das Informações</a>
                    <a href="#6" className="text-green-700 font-bold">6. Direitos do Usuário</a>
                    <a href="#7" className="text-green-700 font-bold">7. Consentimento</a>
                    <a href="#8" className="text-green-700 font-bold">8. Retenção de Dados</a>
                    <a href="#9" className="text-green-700 font-bold">9. Atualizações da Política</a>
                    <a href="#10" className="text-green-700 font-bold">10. Canal de Contato</a>

                </div>

                <section className="flex flex-col gap-20 sm:max-w-200 max-w-800 mr-10 ml-10">
                    {termos.map((termo) => {
                        return (
                            <div
                                key={termo.id}
                                id={termo.id}
                                className="flex flex-col gap-4 scroll-mt-30"
                            >
                                <h1 className="text-3xl font-bold text-yellow-300">{termo.id}. {termo.titulo}</h1>
                                <hr className="opacity-20" />
                                <p className="text-lg">{termo.texto}</p>
                            </div>
                        );
                    })}
                </section>
            </main>
        </>
    );
}
