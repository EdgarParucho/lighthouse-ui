import './skeleton.css'

const tableSquares = (window.screen.width > 768) ? 12 : 7;

const Skeleton = () => <>
  <div className='skeleton-container'>
    <div className="skeleton skeleton_mx-auto skeleton_w-lg skeleton_my-40" />
    <div className="flex-container">
      <div className="skeleton skeleton_w-lg" />
      {Array.from({ length: tableSquares }, (_, i) => (
        <div className="skeleton skeleton_w-sm" key={i} />
      ))}
    </div>
    <div className="flex-container">
      <div className="skeleton skeleton_w-lg" />
      {Array.from({ length: tableSquares }, (_, i) => (
        <div className="skeleton skeleton_w-sm" key={i} />
      ))}
    </div>
    <div className="flex-container">
      <div className="skeleton skeleton_w-lg" />
      {Array.from({ length: tableSquares }, (_, i) => (
        <div className="skeleton skeleton_w-sm" key={i} />
      ))}
    </div>
    <div className="bottom-container">
      <div className="skeleton skeleton_mt-10 skeleton_mx-auto skeleton_squared"></div>
      <div className="skeleton_mx-auto">
        <div className="skeleton skeleton_w-xl skeleton_mx-auto skeleton_mt-10" />
        <div className="skeleton skeleton_w-xl skeleton_mx-auto skeleton_mt-10" />
        <div className="skeleton skeleton_w-xl skeleton_mx-auto skeleton_mt-10" />
      </div>
    </div>
  </div>
</>

export default Skeleton
