export default function Contato() {

    
    return (
        <>
            <main className="mt-50 mb-50">
                <form className="flex flex-col align-center max-w-2xl mx-auto p-10 border border-transparent rounded-2xl shadow-xl">
                    <h1 className="text-3xl text-center font-bold text-gray-800 mb-10">
                        Entre em contato conosco
                    </h1>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Digite seu e-mail:
                        </label>
                        <input
                            type="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="email@exemplo.com"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Digite seu nome:
                        </label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Sobre o que você quer falar?
                        </label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Escreva seu texto:
                        </label>
                        <textarea
                            type="text"
                            maxLength="500"
                            className="overflow-hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-70">
                        Enviar
                    </button>
                </form>
            </main>
        </>
    );
}
