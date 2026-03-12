const memoryStore = [];

function addFeedback(payload) {
  const entry = {
    _id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  memoryStore.unshift(entry);
  return entry;
}

function listFeedback() {
  return memoryStore.slice(0, 200);
}

module.exports = {
  addFeedback,
  listFeedback
};
