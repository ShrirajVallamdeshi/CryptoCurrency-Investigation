// Load the CSV file and create the graph
function loadGraph() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;
        const nodes = {};
        const edges = [];

        // Split CSV data by lines and iterate over each line
        csvData.split('\n').forEach(line => {
            // Skip header line
            if (!line.startsWith('Block')) {
                const [blockNumber, timestamp, value, gasFee, from, to] = line.split(',');

                // Add nodes if not already present
                if (!nodes[from]) {
                    nodes[from] = {
                        id: from,
                        label: '', // Initially empty label
                        shape: 'image',
                        image: 'eth.png', // Replace 'url_to_image' with the URL of the image for this node
                        size: 30,
                        title: `Address: ${from}\nTime: ${timestamp}\nValue: ${value}\nGas Used: ${gasFee}`
                    };
                }
                if (!nodes[to]) {
                    nodes[to] = {
                        id: to,
                        label: '', // Initially empty label
                        shape: 'image',
                        image: 'eth.png', // Replace 'url_to_image' with the URL of the image for this node
                        size: 30,
                        title: `Address: ${to}\nTime: ${timestamp}\nValue: ${value}\nGas Used: ${gasFee}`
                    };
                }

                edges.push({ from: from, to: to }); // Ensure proper structure of edge definition
            }
        });

        // Filter out isolated nodes (nodes without edges)
        const connectedNodes = new Set(edges.flatMap(edge => [edge.from, edge.to]));
        Object.keys(nodes).forEach(nodeId => {
            if (!connectedNodes.has(nodeId)) {
                delete nodes[nodeId]; // Remove isolated nodes
            }
        });

        // Create a network
        const container = document.getElementById('mynetwork');
        const data = {
            nodes: Object.values(nodes),
            edges: edges
        };
        const options = {
            nodes: {
                borderWidth: 0, // Hide border
                font: {
                    size: 0 // Hide label text initially
                }
            },
            tooltip: {
                delay: {
                    show: 0,
                    hide: 0
                },
                // Add styling options for tooltip if needed
            },
            edges: {
                // Add any edge-specific options here if needed
            },
            // Add background color
            backgroundColor: {
                fill: '#FF5733' // Set the desired color code
            }
        };

        const network = new vis.Network(container, data, options);

        // Event listener for showing label on hover
        network.on("hoverNode", function(event) {
            const nodeId = event.node;
            const node = nodes[nodeId];
            node.label = nodeId; // Show label on hover
            network.body.emitter.emit('_dataChanged');
        });

        // Event listener for hiding label on mouseout
        network.on("blurNode", function() {
            Object.values(nodes).forEach(node => {
                node.label = ''; // Hide label on mouseout
            });
            network.body.emitter.emit('_dataChanged');
        });
    };

    reader.readAsText(file);
}
