import slowDown from "express-slow-down";

const speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000,
    delayAfter: 60,
     delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit; // which is 60
    return (used - delayAfter) * 500;
}
// This way:
// 61st request → (61 - 60) × 500 = 500 ms delay
// 62nd request → (62 - 60) × 500 = 1000 ms delay
// 63rd request → (63 - 60) × 500 = 1500 ms delay
// 64th request → (64 - 60) × 500 = 2000 ms delay
});
export default speedLimiter;



//NOTES 

 //✅ Why This Matters
// ✅ Prevents overwhelming your server
// ✅ Makes abusive clients slower
// ✅ Still responds successfully after the delay

//[Client] ---> [SpeedLimiter Middleware] --(wait delay)--> [Route Handler] ---> Response


// ✅ Example

// User sends 55 requests in 15 mins:

// Requests 1–50 → instant processing.

// Request 51 → delayed by 500ms before handler runs.

// Request 52 → delayed by 1000ms before handler runs.

