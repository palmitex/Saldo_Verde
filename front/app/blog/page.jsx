'use client';

export default function Blog() {
    return (
        <section className="bg-[#014038] text-white px-6 py-12 md:py-20 md:px-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Texto à esquerda */}
                <div className="w-full md:w-1/2">
                    {/* Tags */}
                    <div className="flex gap-3 mb-4">
                        <span className="bg-white bg-opacity-10 px-4 py-1 rounded-full text-sm">FINANÇAS</span>
                        <span className="bg-white bg-opacity-10 px-4 py-1 rounded-full text-sm">OUTRO</span>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        Como Funciona o Pix por Aproximação?
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-base md:text-lg text-white/80 mb-6">
                        Entenda o que é Pix por aproximação, suas características e como utilizar no cotidiano.
                    </p>

                    {/* Link */}
                    <a href="#" className="inline-flex items-center text-yellow-400 hover:underline font-medium">
                        Continuar lendo
                        <span className="ml-2">→</span>
                    </a>
                </div>

                {/* Imagem à direita */}
                <div className="w-200 md:w-1/2 relative">
                    <div className="relative z-10 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="/ImagemTeste.png" // Substitua pelo caminho correto
                            alt="Pix por Aproximação"
                            className="w-200 h-100 object-cover"
                        />
                    </div>

                    {/* Decoração com pseudo forma */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-yellow-400 rounded-full z-0 opacity-70 hidden md:block" />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full z-0 opacity-70 hidden md:block" />
                </div>
            </div>
        </section>
    );
}