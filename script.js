
document.addEventListener('DOMContentLoaded' , function(){
    const portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
    const form = document.getElementById('investment-form');
    const portfolioTable = document.getElementById('portfolio-table');
    const totalInvestmentEl = document.getElementById('total-investment');
    const ctx = document.getElementById('performanceChart').getContext('2d');

    let chart;

    // update chart

    function updateChart(){
        const labels = portfolio.map(item => item.name);
        const data = portfolio.map(item => item.performance);

        if (chart){
            chart.destroy();
        }
        
        chart = new Chart(ctx,{
            type: 'bar',
            data:{
               labels: labels ,
               datasets: [{
                label: 'Performance (%)',
                data: data,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1
               }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }

        });


    }

    // calculate total investment
    function calculateTotal(){
        const total = portfolio.reduce((sum, item) => sum + parseFloat(item.amount),0);
        totalInvestmentEl.textContent = total.toFixed(2);
    }

    // render portfolio in table

    function renderPortfolio(){
        portfolioTable.innerHTML = "";
        portfolio.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.name}</td>
            <td>$${parseFloat(item.amount).toFixed(2)}</td>
            <td>${parseFloat(item.performance).toFixed(2)}%</td>
            <td>
            <button onclick = "editInvestment(${index})">Edit</button>
            <button onclick = "deleteInvestment(${index})">Delete</button>
            </td>
            `;

            portfolioTable.appendChild(row);
        });
        calculateTotal();
        updateChart();
    }

    // add new investment

    form. addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('name').value;
        const amount = document.getElementById('amount').value;
        const performance = document.getElementById('performance').value;


        portfolio.push({name, amount, performance});
        localStorage.setItem('portfolio',JSON.stringify(portfolio));

        form.reset();
        renderPortfolio();
    });

    // Edit investment

    Window.editInvestment = function(index){
        const investment = portfolio[index];
        document.getElementById('name').value = investment.name
        document.getElementById('amount').value = investment.amount;
        document.getElementById('performance').value = investment.performance;
        
        portfolio.splice(index,1);
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        renderPortfolio();

    };

    // Delete investment
    window.deleteInvestment = function(index){
        portfolio.splice(index,1);
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        renderPortfolio();
    };

    //initial render

    renderPortfolio();

} );