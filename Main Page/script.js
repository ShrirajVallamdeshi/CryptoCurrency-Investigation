


/** Home Page
 * Event listener that triggers when the DOM content is loaded.
 * It handles the click event on the tabs and performs actions accordingly.
 */
document.addEventListener("DOMContentLoaded", function() {
    /**
     * The collection of tab elements.
     * @type {NodeList}
     */
    const tabs = document.querySelectorAll('.tab');

    /**
     * The collection of section elements.
     * @type {NodeList}
     */
    const sections = document.querySelectorAll('section');

    tabs.forEach((tab, index) => {
        /**
         * Event listener that triggers when a tab is clicked.
         * It scrolls to the corresponding section and updates the tab states.
         */
        tab.addEventListener('click', () => {
            // Scroll to the corresponding section
            sections[index].scrollIntoView({ behavior: 'smooth' });

            // Remove the 'checked' state from other tabs
            tabs.forEach((t) => t.checked = false);

            // Check the clicked tab
            tab.checked = true;
        });
    });
});
/**
 
/** detection Page
 * Event listener that triggers when the DOM content is loaded.
 * It handles the click event on the 'Detection' tab and performs actions accordingly.
 */
document.addEventListener("DOMContentLoaded", function() {
    /**
     * The 'Detection' tab element.
     * @type {HTMLElement}
     */
    const detectionTab = document.getElementById('tab2'); // Assuming 'Detection' tab is the second tab

    /**
     * The section containing the 'Detection' content.
     * @type {HTMLElement}
     */
    const detectionSection = document.getElementById('Detection');

    /**
     * Event listener that triggers when the 'Detection' tab is clicked.
     * It scrolls to the section containing "Fraud Detection Techniques" and opens the associated cards.
     */
    detectionTab.addEventListener('click', () => {
        // Scroll to the section containing "Fraud Detection Techniques"
        detectionSection.scrollIntoView({ behavior: 'smooth' });
        
        // Open the cards associated with fraud detection techniques
        const detectionCards = document.querySelectorAll('.card');
        detectionCards.forEach(card => {
            card.style.display = 'block'; // or any other display style appropriate for your layout
        });
    });
});
/** Investigation Page **/
document.addEventListener("DOMContentLoaded", function() {
    const investigationTab = document.getElementById('tab3'); // Assuming 'Investigation' tab is the third tab
    const investigationSection = document.getElementById('investigation');

    investigationTab.addEventListener('click', () => {
        // Scroll to the section containing "Investigation Techniques"
        investigationSection.scrollIntoView({ behavior: 'smooth' });
        
        // Open the cards associated with investigation techniques
        const investigationCards = document.querySelectorAll('.section-content:nth-child(3) .card'); // Assuming investigation cards are in the third section-content
        investigationCards.forEach(card => {
            card.style.display = 'block'; // or any other display style appropriate for your layout
        });
    });
});


  // Add click event listener to the button
  document.getElementById("Suspecious_Address").addEventListener("click", function() {
      // Open the link in the re-box
      window.open("file:///C:/Users/Sairam%20Gudeli/Desktop/CBIT/Suspicious%20Address/index.html", "_self");
   });

