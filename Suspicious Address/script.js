function handleFile() {
    var fileInput = document.getElementById('csv-file');
    var file = fileInput.files[0];
    
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                var data = results.data;
                analyzeTransactions(data);
            }
        });
    } else {
        alert('Please select a CSV file.');
    }
}

function analyzeTransactions(data) {
    // Convert CSV data to DataFrame
    var df = parseCSVToDataFrame(data);
  
    // Group by sender and recipient and calculate the number of transactions and total value
    var senderStats = calculateSenderStats(df);
    var recipientStats = calculateRecipientStats(df);
  
    // Filter senders and recipients with more than 10 transactions
    var sendersManyTransactions = filterTransactions(senderStats.counts, 10);
    var recipientsManyTransactions = filterTransactions(recipientStats.counts, 10);
  
    // Display the results
    displayResults(sendersManyTransactions, recipientsManyTransactions, senderStats.totalValue, recipientStats.totalValue);
}

function parseCSVToDataFrame(data) {
    // Assuming the first row contains column headers
    var headers = data[0];
    var rows = data.slice(1);
    var df = {};
    for (var i = 0; i < headers.length; i++) {
        df[headers[i]] = [];
    }
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < headers.length; j++) {
            df[headers[j]].push(rows[i][j]);
        }
    }
    return df;
}

function calculateSenderStats(df) {
    var counts = {};
    var totalValue = {};
    for (var i = 0; i < df.sender.length; i++) {
        var sender = df.sender[i];
        var value = parseFloat(df.value[i]); // Assuming value is a numerical column
        counts[sender] = counts[sender] ? counts[sender] + 1 : 1;
        totalValue[sender] = totalValue[sender] ? totalValue[sender] + value : value;
    }
    return { counts: counts, totalValue: totalValue };
}

function calculateRecipientStats(df) {
    var counts = {};
    var totalValue = {};
    for (var i = 0; i < df.recipient.length; i++) {
        var recipient = df.recipient[i];
        var value = parseFloat(df.value[i]); // Assuming value is a numerical column
        counts[recipient] = counts[recipient] ? counts[recipient] + 1 : 1;
        totalValue[recipient] = totalValue[recipient] ? totalValue[recipient] + value : value;
    }
    return { counts: counts, totalValue: totalValue };
}

function filterTransactions(counts, threshold) {
    var filtered = {};
    for (var key in counts) {
        if (counts.hasOwnProperty(key) && counts[key] > threshold) {
            filtered[key] = counts[key];
        }
    }
    return filtered;
}

function displayResults(senders, recipients, senderTotalValue, recipientTotalValue) {
    var resultDiv = document.getElementById('result');
    var tableHTML = "<h2>Senders with more than 10 transactions:</h2><table><tr><th>Sender</th><th>Number of Transactions</th><th>Total Value (Ether)</th></tr>";
    for (var sender in senders) {
        if (senders.hasOwnProperty(sender)) {
            tableHTML += "<tr><td>" + sender + "</td><td>" + senders[sender] + "</td><td>" + weiToEther(senderTotalValue[sender]) + "</td></tr>";
        }
    }
    tableHTML += "</table><h2>Recipients with more than 10 transactions:</h2><table><tr><th>Recipient</th><th>Number of Transactions</th><th>Total Value (Ether)</th></tr>";
    for (var recipient in recipients) {
        if (recipients.hasOwnProperty(recipient)) {
            tableHTML += "<tr><td>" + recipient + "</td><td>" + recipients[recipient] + "</td><td>" + weiToEther(recipientTotalValue[recipient]) + "</td></tr>";
        }
    }
    tableHTML += "</table>";
    resultDiv.innerHTML = tableHTML;
}

function weiToEther(wei) {
    return wei / 1e18; // 1 Ether = 10^18 Wei
}
