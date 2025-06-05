let currentStep = 1;
        const totalSteps = 4;
        let productNames = [];
        
        // Update progress bar
        function updateProgress() {
            const progressPercent = (currentStep / totalSteps) * 100;
            document.getElementById('progress-bar').style.width = `${progressPercent}%`;
            document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
            document.getElementById('current-step').textContent = currentStep;
            
        }

        function setupPlanSelection() {
            const planOptions = document.querySelectorAll('.plan-option');
            planOptions.forEach(option => {
                option.addEventListener('click', () => {
                    planOptions.forEach(opt => opt.classList.remove('ring', 'ring-primary-500'));
                    option.classList.add('ring', 'ring-primary-500');
                    option.querySelector('input[type="radio"]').checked = true;
                });
            });
        }

        
        // Navigate to next step
        function nextStep() {
            if (validateStep(currentStep)) {
                document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
                currentStep++;
                document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
                updateProgress();

                // Re-initialiser les événements lors de l’entrée sur l'étape 3
                if (currentStep === 3) {
                    setupPlanSelection();
                }
                
                // Generate summary on last step
                if (currentStep === totalSteps) {
                    generateSummary();
                }
            }
        }
        
        // Navigate to previous step
        function prevStep() {
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
            currentStep--;
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
            updateProgress();
        }
        
        // Validate current step before proceeding
        function validateStep(step) {
            let isValid = true;
            
            if (step === 1) {
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                
                if (!firstName || !lastName || !email) {
                    isValid = false;
                    alert('Veuillez remplir tous les champs obligatoires (marqués d\'un *)');
                } else if (!validateEmail(email)) {
                    isValid = false;
                    alert('Veuillez entrer une adresse email valide');
                }
            } else if (step === 2) {
                const address = document.getElementById('address').value;
                const siret = document.getElementById('siret').value;
                const city = document.getElementById('city').value;

                if (!address || !siret || !city) {
                    isValid = false;
                    alert('Veuillez remplir tous les champs obligatoires (marqués d\'un *)');
                }
            } else if (step === 3) {
                const planOptions = document.querySelectorAll('.plan-option');
                //const plan = document.getElementById('plan').value;
                const products = document.querySelectorAll('input[name="products"]:checked');
                
                planOptions.forEach(option => {
                    option.addEventListener('click', () => {
                        planOptions.forEach(opt => opt.classList.remove('ring', 'ring-primary-500'));
                        option.classList.add('ring', 'ring-primary-500');
                        option.querySelector('input[type="radio"]').checked = true;
                    });
                });

                const plan = document.querySelector('input[name="plan"]:checked')?.value;
                
                if (!plan) {
                    isValid = false;
                    alert('Veuillez sélectionner un plan');
                } else if (products.length === 0) {
                    isValid = false;
                    alert('Veuillez sélectionner au moins un produit');
                }
            }
            
            return isValid;
        }
        
        // Email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Generate summary for confirmation step
        function generateSummary() {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const siret = document.getElementById('siret').value;
            const entreprise = document.getElementById('entreprise').value;
            const city = document.getElementById('city').value;
            const plan = document.querySelector('input[name="plan"]:checked')?.value;
            const products = Array.from(document.querySelectorAll('input[name="products"]:checked')).map(el => el.value);
            
            /*console.log('Plan:', plan);
            console.log('Products:', products);*/
            
            // Create summary HTML

            let planName = '';
            switch(plan) {
                case 'basic': planName = 'Basic - €49/mois'; break;
                case 'standard': planName = 'Standard - €79/mois'; break;
                case 'premium': planName = 'Premium - €89/mois'; break;
            }
            
            
            /*products.forEach(product => {
                switch(product) {
                    case 'chatbot': productNames.push('Chatbot IA'); break;
                    case 'docflow': productNames.push('DocFlow'); break;
                    case 'mailpilot': productNames.push('MailPilot'); break;
                }
            });*/
            
            const summaryHTML = `
                <p><strong>Nom complet:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ""}
                <p><strong>Entreprise:</strong> ${entreprise}, ${siret}</p>
                <p><strong>Adresse:</strong> ${address}, ${city}</p>
                <p class="mt-3"><strong>Plan sélectionné:</strong> ${planName}</p>
                <p><strong>Produits:</strong> ${products.join(", ")}</p>
            `;
            
            document.getElementById('summary-content').innerHTML = summaryHTML;
        }
        
        // Enable/disable submit button based on terms checkbox
        document.getElementById('terms').addEventListener('change', function() {
            document.getElementById('submit-btn').disabled = !this.checked;
            if (this.checked) {
                document.getElementById('submit-btn').classList.remove('bg-gray-300', 'text-gray-500');
                document.getElementById('submit-btn').classList.add('bg-primary-600', 'hover:bg-primary-700', 'text-white');
            } else {
                document.getElementById('submit-btn').classList.add('bg-gray-300', 'text-gray-500');
                document.getElementById('submit-btn').classList.remove('bg-primary-600', 'hover:bg-primary-700', 'text-white');
            }
        });
        
        // Form submission
        document.getElementById('laneAIForm').addEventListener('submit', function(e) {
            e.preventDefault();
    
            const products = Array.from(document.querySelectorAll('input[name="products"]:checked')).map(el => el.value);

            const formData = new FormData();
            formData.append('prenom', document.getElementById('firstName').value);
            formData.append('nom', document.getElementById('lastName').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('telephone', document.getElementById('phone').value);
            formData.append('adresse', document.getElementById('address').value);
            formData.append('siret', document.getElementById('siret').value);
            formData.append('entreprise', document.getElementById('entreprise').value);
            formData.append('ville', document.getElementById('city').value);
            formData.append('plan', document.querySelector('input[name="plan"]:checked')?.value);
            formData.append('produits', products.join(', '));
            
            // Log form data for debugging
            console.log('Form Data:', formData);

            fetch('https://n8n.srv807721.hstgr.cloud/webhook/lane-ai', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    showPopup('Formulaire soumis avec succès! Merci pour votre inscription.');
                    window.location.href = "https://laneai.netlify.app/merci.html";
                } else {
                    showPopup('Erreur lors de la soumission du formulaire.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showPopup('Erreur lors de la soumission du formulaire.');
            });
            
            // Reset form and go back to step 1
            /*this.reset();
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
            currentStep = 1;
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
            updateProgress();
            document.getElementById('submit-btn').disabled = true;
            document.getElementById('submit-btn').classList.add('bg-gray-300', 'text-gray-500');
            document.getElementById('submit-btn').classList.remove('bg-primary-600', 'hover:bg-primary-700', 'text-white');*/
        });

        function showPopup(message) {
            alert(message); // Replace with a proper popup implementation if needed
        }