const IPFS = require('ipfs-api')

// Using local IPFS node
// Make sure IPFS daemon is running: ipfs daemon
const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' })

export default ipfs
