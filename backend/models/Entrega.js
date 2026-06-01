const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Entrega = sequelize.define('Entrega', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    entregador: { type: DataTypes.STRING, allowNull: false },
    destino: { type: DataTypes.STRING, allowNull: false },
    horaoPrevisto: { type: DataTypes.DATE, allowNull: false },
    horarioTexto: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    horarioConclusao: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'entregas'
  });

  Entrega.beforeCreate((entrega, opts) => {
    if (!entrega.id) entrega.id = `UL-${Math.floor(Math.random()*900)+100}`;
  });

  return Entrega;
};
