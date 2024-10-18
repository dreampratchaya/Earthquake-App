// src/ColorBar.js
const ColorBar = ({ items }) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD'];
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '50px', border: '1px solid #ccc' }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: colors[index],
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              borderBottom: index < items.length - 1 ? '1px solid #ccc' : 'none',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };
  
  export default ColorBar;
