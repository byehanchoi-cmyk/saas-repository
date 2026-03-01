export function FocusModeSection() {
    return (
        <div className="w-full bg-background-light dark:bg-background-dark py-20 px-4">
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div
                    className="w-full aspect-video bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCilLm3-wpgcXmuRM_55ud_MdgdMuK2PlFDYtVewiJs0SL-kdzZNsAZ1xExhywzlGdzMtlWu00Lz_bcmgToFtenBZI__bGR_OhDKWDH2ycFEem-ReWwlFF6Pw3IiRBY_T_uZtm3_sU5lEczpT3HubwstYQWv09wgcTlE5Ks7-XO7wvPh919AIdFXKWpmQvpCn_W50tk8VKw1-Mi6Ww1_j8SgQpNHC-_0Doex5aJ0Y8jYoz70y9NFUmQoZq9tKuU-RXN6iydO6kDFNBI')" }}
                >
                    {/* Custom content overlay */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-2xl">
                        <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">Focus on what matters.</h2>
                        <p className="text-slate-200 text-lg mb-6">Distraction-free mode helps you get in the zone and stay there. Customize your environment to match your workflow.</p>
                        <button className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">Try Focus Mode</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
