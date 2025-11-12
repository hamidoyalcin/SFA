// script.js

// When the DOM is ready, initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set the current year in the footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /*
     * Kursdaten und Dienstleistungen
     *
     * Jede Zeile repräsentiert einen Termin oder eine Leistung.
     * Passen Sie dieses Array an, um wöchentlich neue Termine
     * hinzuzufügen oder bestehende zu entfernen. Jede Eigenschaft
     * hat folgende Bedeutung:
     * - type: Art des Kurses oder der Dienstleistung
     * - date: Datum (String)
     * - time: Zeit (String)
     * - location: Ort (String)
     * - price: Preis (String)
     */
    // Kursdaten für die nächsten vier Termine. Jede Anmeldung umfasst Erste Hilfe, Passbilder und Sehtest.
    const coursesData = [
        {
            type: 'Erste‑Hilfe / Passbild / Sehtest',
            date: '05. November 2025',
            time: '09:00 – 15:00',
            location: 'Augsburg'
        },
        {
            type: 'Erste‑Hilfe / Passbild / Sehtest',
            date: '12. November 2025',
            time: '09:00 – 15:00',
            location: 'Augsburg'
        },
        {
            type: 'Erste‑Hilfe / Passbild / Sehtest',
            date: '19. November 2025',
            time: '09:00 – 15:00',
            location: 'Augsburg'
        },
        {
            type: 'Erste‑Hilfe / Passbild / Sehtest',
            date: '26. November 2025',
            time: '09:00 – 15:00',
            location: 'Augsburg'
        }
    ];

    // Dynamisch die Kurs- und Termin-Tabelle aufbauen
    const coursesBody = document.getElementById('coursesBody');
    if (coursesBody) {
        coursesData.forEach((item) => {
            const tr = document.createElement('tr');
            // Kurs
            const tdType = document.createElement('td');
            tdType.textContent = item.type;
            tdType.setAttribute('data-label', 'Kurs');
            tr.appendChild(tdType);
            // Datum
            const tdDate = document.createElement('td');
            tdDate.textContent = item.date;
            tdDate.setAttribute('data-label', 'Datum');
            tr.appendChild(tdDate);
            // Uhrzeit
            const tdTime = document.createElement('td');
            tdTime.textContent = item.time;
            tdTime.setAttribute('data-label', 'Uhrzeit');
            tr.appendChild(tdTime);
            // Ort
            const tdLocation = document.createElement('td');
            tdLocation.textContent = item.location;
            tdLocation.setAttribute('data-label', 'Ort');
            tr.appendChild(tdLocation);
            // Buchungsbutton
            const tdAction = document.createElement('td');
            const link = document.createElement('a');
            link.classList.add('btn', 'small-btn');
            link.textContent = 'Jetzt buchen';
            // Compose mailto link for each row
            const subject = encodeURIComponent(`Anmeldung: ${item.type} am ${item.date}`);
            const bodyLines = [];
            bodyLines.push('Guten Tag,');
            bodyLines.push('');
            bodyLines.push('Ich möchte mich für folgenden Termin anmelden:');
            bodyLines.push(`Kurs: ${item.type}`);
            bodyLines.push(`Datum: ${item.date}`);
            bodyLines.push(`Uhrzeit: ${item.time}`);
            bodyLines.push(`Ort: ${item.location}`);
            bodyLines.push('');
            bodyLines.push('Bitte bestätigen Sie meine Anmeldung.');
            bodyLines.push('');
            const body = encodeURIComponent(bodyLines.join('\n'));
            link.href = `mailto:seyisfirstaid@gmail.com?subject=${subject}&body=${body}`;
            link.setAttribute('target', '_blank');
            tdAction.appendChild(link);
            tr.appendChild(tdAction);
            coursesBody.appendChild(tr);
        });
    }

    // Auswahlfeld für das Formular füllen
    const dateSelect = document.getElementById('selectedDate');
    if (dateSelect) {
        coursesData.forEach((item) => {
            // Nur Kurse mit konkretem Datum werden für die Auswahl übernommen
            if (item.date && item.time && !/Vereinbarung/i.test(item.date)) {
                const option = document.createElement('option');
                option.value = `${item.type} am ${item.date}`;
                option.textContent = `${item.type} – ${item.date}`;
                dateSelect.appendChild(option);
            }
        });
    }

    // Formularverarbeitung: erzeugt entweder eine Mail oder eine WhatsApp-Nachricht
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('customerName');
            const emailInput = document.getElementById('customerEmail');
            const phoneInput = document.getElementById('customerPhone');
            const selectedOption = document.getElementById('selectedDate');
            const messageInput = document.getElementById('customerMessage');
            const methodInputs = document.getElementsByName('contactMethod');

            const userName = nameInput.value.trim();
            const userEmail = emailInput.value.trim();
            const userPhone = phoneInput.value.trim();
            const selectedValue = selectedOption.value;
            const additionalMessage = messageInput.value.trim();
            let contactMethod = 'email';
            methodInputs.forEach((input) => {
                if (input.checked) contactMethod = input.value;
            });

            // Gemeinsame Nachrichtenteile
            const bodyLines = [];
            bodyLines.push('Guten Tag,');
            bodyLines.push('');
            bodyLines.push(`Mein Name: ${userName}`);
            bodyLines.push(`Meine Telefonnummer: ${userPhone}`);
            bodyLines.push(`Meine E‑Mail: ${userEmail}`);
            if (selectedValue) {
                bodyLines.push(`Gewünschter Termin: ${selectedValue}`);
            }
            if (additionalMessage) {
                bodyLines.push('');
                bodyLines.push('Weitere Nachricht:');
                bodyLines.push(additionalMessage);
            }
            bodyLines.push('');
            bodyLines.push('Bitte kontaktieren Sie mich für weitere Details.');

            if (contactMethod === 'whatsapp') {
                // Sende Nachricht via WhatsApp an den Firmenkontakt
                const whatsappNumber = '491626408877';
                const waMessage = encodeURIComponent(bodyLines.join('\n'));
                const waLink = `https://wa.me/${whatsappNumber}?text=${waMessage}`;
                window.open(waLink, '_blank');
            } else {
                // E-Mail senden
                let subject = 'Kursanfrage';
                if (selectedValue) {
                    subject += `: ${selectedValue}`;
                }
                const mailtoLink = `mailto:seyisfirstaid@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
                window.location.href = mailtoLink;
            }

            // Formular zurücksetzen
            bookingForm.reset();
        });
    }

    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });
        // Close the mobile nav when a link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
            });
        });
    }
});