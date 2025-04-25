// assets/js/backend.js

// Função para formatar telefone
function formatarTelefone(input) {
    // Remove tudo que não é dígito
    let value = input.value.replace(/\D/g, '');
    
    // Limita a 11 caracteres (DDD + 9 dígitos)
    value = value.substring(0, 11);
    
    // Aplica a máscara (00) 00000-0000
    if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 10) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
    }
    
    input.value = value;
}

// Função para mostrar feedback ao usuário
function mostrarFeedback(mensagem, tipo) {
    // Remove feedbacks anteriores
    const feedbacksAnteriores = document.querySelectorAll('.form-feedback');
    feedbacksAnteriores.forEach(feedback => feedback.remove());
    
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `form-feedback ${tipo}`;
    feedbackElement.textContent = mensagem;
    
    const form = document.getElementById('formNI');
    if (form) {
        form.insertBefore(feedbackElement, form.firstChild);
    }
    
    // Remove o feedback após 5 segundos
    setTimeout(() => {
        feedbackElement.remove();
    }, 5000);
}

// Funções para controlar o modal
function mostrarFormulario() {
    const modal = document.getElementById("formulario-lead");
    if (modal) {
        modal.classList.add("active");
        document.body.classList.add("modal-aberto");
        const nomeInput = document.getElementById("nome");
        if (nomeInput) nomeInput.focus();
    }
}

function fecharFormulario() {
    const modal = document.getElementById("formulario-lead");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-aberto");
    }
}

async function enviarFormulario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome')?.value.trim();
    const whatsapp = document.getElementById('whatsapp')?.value.replace(/\D/g, '');
    const submitBtn = document.querySelector('#formNI button[type="submit"]');

    if (!nome || !whatsapp || !submitBtn) return;

    if (nome.length < 3) {
        mostrarFeedback('Por favor, insira seu nome completo', 'erro');
        return;
    }

    if (whatsapp.length !== 11) {
        mostrarFeedback('WhatsApp deve ter 11 dígitos (com DDD)', 'erro');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    const dadosLead = {
        name: nome,
        phone: `+55${whatsapp}`,
        email: null, // Ou capturar se você quiser incluir um campo de e-mail
        notes: "Lead captada na Landing Page DAQ",
        tags: ["Mentoria DAQ 2025"]
    };

    try {
        const response = await fetch("https://api.notificacoesinteligentes.com/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5ub3RpZmljYWNvZXNpbnRlbGlnZW50ZXMuY29tOjg0NDMvb3JnYW5pemF0aW9ucy9hcGktdG9rZW4iLCJpYXQiOjE3NDU2MTYyNDYsIm5iZiI6MTc0NTYxNjI0NiwianRpIjoiQUxNeHZ1ZXlSaUNXbGk2NCIsInN1YiI6IjE0Njc2IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyIsIm9yZ2FuaXphdGlvbl9pZCI6MTQxODUsInVzZXJfaWQiOjE0Njc2LCJlbWFpbCI6InNhdWxvZ2cxMDBAZ21haWwuY29tIiwidHlwZSI6InVzZXIiLCJyb2xlIjoiYWRtaW4iLCJmZWF0dXJlX2NoYW5uZWwiOiJzdGFibGUiLCJvcmdhbml6YXRpb25fbmFtZSI6IlNPIFBPUiBRVUVTVE9FUyIsImp3dF90eXBlIjoiYXBpX3Rva2VuIn0.TMs5koJQejkjMlZQcqw2zmhAs4dLcZrP6OKF4D1RRGc"
            },
            body: JSON.stringify(dadosLead)
        });

        const responseData = await response.json();
        console.log('Resposta da API:', responseData);

        if (response.ok) {
            mostrarFeedback('Cadastro realizado com sucesso!', 'sucesso');
            document.getElementById('formNI').reset();
            setTimeout(fecharFormulario, 2000);
            if (typeof fbq !== 'undefined') fbq('track', 'Lead');
            if (typeof gtag !== 'undefined') gtag('event', 'conversion');
        } else {
            console.error('Erro na resposta:', responseData);
            mostrarFeedback('Erro ao enviar. Verifique os dados ou tente novamente.', 'erro');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarFeedback('Erro de conexão. Tente novamente ou nos chame no WhatsApp.', 'erro');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Quero me inscrever';
    }
}


// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-quad',
        once: true,
        offset: 50,
        delay: 100
    });

    // Reduzir movimento para usuários que preferem
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        AOS.init({
            disable: true
        });
    }

    // Fechar modal ao clicar fora
    const modal = document.querySelector('.modal-form');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharFormulario();
            }
        });
    }

    // Configuração do formulário
    const form = document.getElementById('formNI');
    if (form) {
        form.addEventListener('submit', enviarFormulario);
    }

    // Configuração do campo de telefone
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            formatarTelefone(this);
        });
    }

    // Botão de fechar do modal
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', fecharFormulario);
    }

    // Ativação do vídeo ao clicar
    const videoOverlay = document.querySelector('.video-overlay');
    if (videoOverlay) {
        videoOverlay.addEventListener('click', function() {
            const container = document.getElementById('video-container');
            if (container) {
                container.classList.add('video-active');
                
                // Forçar redimensionamento do iframe após ativação
                const iframe = container.querySelector('.video-iframe');
                if (iframe) {
                    iframe.style.height = iframe.offsetWidth * 0.5625 + 'px';
                }
            }
        });
    }

    // Redimensionamento responsivo do vídeo
    window.addEventListener('resize', function() {
        const container = document.getElementById('video-container');
        if (container) {
            const iframe = container.querySelector('.video-iframe');
            if (iframe) {
                iframe.style.height = iframe.offsetWidth * 0.5625 + 'px';
            }
        }
    });
});

// Exporta funções para serem usadas em onclick no HTML
window.mostrarFormulario = mostrarFormulario;
window.fecharFormulario = fecharFormulario;
window.formatarTelefone = formatarTelefone;