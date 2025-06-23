import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceDot, ResponsiveContainer } from 'recharts';

const generatePoints = () => {
  // First, generate a whole number slope between -5 and 5 (excluding 0)
  const generateSlope = () => {
    const slope = Math.floor(Math.random() * 11) - 5;
    return slope === 0 ? 1 : slope; // Replace 0 with 1 to avoid horizontal lines
  };
  
  // Generate first x-coordinate between -5 and 5
  const x1 = Math.floor(Math.random() * 11) - 5;
  
  // Generate a whole number y-intercept between -5 and 5
  const b = Math.floor(Math.random() * 11) - 5;
  
  // Calculate y1 using y = mx + b
  const slope = generateSlope();
  const y1 = (slope * x1) + b;
  
  // Generate second x-coordinate ensuring it's different from x1
  let x2;
  do {
    x2 = Math.floor(Math.random() * 11) - 5;
  } while (x2 === x1);
  
  // Calculate y2 using the same line equation
  const y2 = (slope * x2) + b;
  
  return { x1, y1, x2, y2 };
};

const TwoPointEquation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Answer, setStep1Answer] = useState('');
  const [step2Answer, setStep2Answer] = useState('');
  const [step3Answer, setStep3Answer] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [problems, setProblems] = useState([generatePoints()]);
  const [invalidAnswers, setInvalidAnswers] = useState({ step1: false, step2: false, step3: false });
  const [stepCompleted, setStepCompleted] = useState({
    step1: false,
    step2: false,
    step3: false
  });
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false,
    step3: false
  });
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);

  useEffect(() => {
    setProblems([generatePoints(), generatePoints(), generatePoints()]);
  }, []);

  useEffect(() => {
    if (stepCompleted.step1 && stepCompleted.step2 && stepCompleted.step3) {
      setShowNavigationButtons(true);
    }
  }, [stepCompleted]);

  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (direction === 'forward' && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  const checkStep1 = () => {
    const points = problems[currentProblem];
    const slope = (points.y2 - points.y1) / (points.x2 - points.x1);
    const userSlope = parseFloat(step1Answer);
    
    if (isNaN(userSlope)) {
      setInvalidAnswers(prev => ({ ...prev, step1: true }));
      return;
    }
    
    const isCorrect = Math.abs(userSlope - slope) < 0.01;
    
    if (isCorrect) {
      setInvalidAnswers(prev => ({ ...prev, step1: false }));
      setStepCompleted(prev => ({ ...prev, step1: true }));
      setStepSkipped(prev => ({ ...prev, step1: false }));
    } else {
      setInvalidAnswers(prev => ({ ...prev, step1: true }));
    }
  };

  const checkStep2 = () => {
    const points = problems[currentProblem];
    const slope = (points.y2 - points.y1) / (points.x2 - points.x1);
    const yIntercept = points.y1 - (slope * points.x1);
    const userYIntercept = parseFloat(step2Answer);
    
    if (isNaN(userYIntercept)) {
      setInvalidAnswers(prev => ({ ...prev, step2: true }));
      return;
    }
    
    const isCorrect = Math.abs(userYIntercept - yIntercept) < 0.01;
    
    if (isCorrect) {
      setInvalidAnswers(prev => ({ ...prev, step2: false }));
      setStepCompleted(prev => ({ ...prev, step2: true }));
      setStepSkipped(prev => ({ ...prev, step2: false }));
    } else {
      setInvalidAnswers(prev => ({ ...prev, step2: true }));
    }
  };

  const checkStep3 = () => {
    const points = problems[currentProblem];
    const slope = (points.y2 - points.y1) / (points.x2 - points.x1);
    const yIntercept = points.y1 - (slope * points.x1);
    
    // Remove all spaces and convert to lowercase for comparison
    const userEquation = step3Answer.replace(/\s+/g, '').toLowerCase();
    
    // Generate array of acceptable forms
    const acceptableForms = [];
    
    // Standard form
    acceptableForms.push(`y=${slope}x${yIntercept >= 0 ? '+' : ''}${yIntercept}`);
    
    // Special cases
    if (yIntercept === 0) {
      // When y-intercept is 0, allow form without +0
      if (slope === 1) {
        acceptableForms.push('y=x');
      } else if (slope === -1) {
        acceptableForms.push('y=-x');
      } else {
        acceptableForms.push(`y=${slope}x`);
      }
    } else {
      // When slope is 1 or -1, allow simplified forms
      if (slope === 1) {
        acceptableForms.push(`y=x${yIntercept >= 0 ? '+' : ''}${yIntercept}`);
      } else if (slope === -1) {
        acceptableForms.push(`y=-x${yIntercept >= 0 ? '+' : ''}${yIntercept}`);
      }
    }
    
    const isCorrect = acceptableForms.includes(userEquation);
    
    if (isCorrect) {
      setInvalidAnswers(prev => ({ ...prev, step3: false }));
      setStepCompleted(prev => ({ ...prev, step3: true }));
      setStepSkipped(prev => ({ ...prev, step3: false }));
    } else {
      setInvalidAnswers(prev => ({ ...prev, step3: true }));
    }
  };

  const skipStep = (step) => {
    const points = problems[currentProblem];
    const slope = (points.y2 - points.y1) / (points.x2 - points.x1);
    const yIntercept = points.y1 - (slope * points.x1);
    
    if (step === 1) {
      setStep1Answer(slope.toString());
    } else if (step === 2) {
      setStep2Answer(yIntercept.toString());
    } else if (step === 3) {
      let equation;
      if (yIntercept === 0) {
        if (slope === 1) {
          equation = 'y = x';
        } else if (slope === -1) {
          equation = 'y = -x';
        } else {
          equation = `y = ${slope}x`;
        }
      } else {
        if (slope === 1) {
          equation = `y = x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
        } else if (slope === -1) {
          equation = `y = -x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
        } else {
          equation = `y = ${slope}x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
        }
      }
      setStep3Answer(equation);
    }
    setStepCompleted(prev => ({ ...prev, [`step${step}`]: true }));
    setStepSkipped(prev => ({ ...prev, [`step${step}`]: true }));
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(prev => prev + 1);
    } else {
      setProblems(prev => [...prev, generatePoints()]);
      setCurrentProblem(prev => prev + 1);
    }
    setInvalidAnswers({ step1: false, step2: false, step3: false });
    setStep1Answer('');
    setStep2Answer('');
    setStep3Answer('');
    setCurrentStep(1);
    setShowSteps(false);
    setStepCompleted({ step1: false, step2: false, step3: false });
    setStepSkipped({ step1: false, step2: false, step3: false });
    setShowNavigationButtons(false);
  };

  const startCalculation = () => {
    setShowSteps(true);
    setCurrentStep(1);
    setStep1Answer('');
    setStep2Answer('');
    setStep3Answer('');
    setInvalidAnswers({ step1: false, step2: false, step3: false });
    setStepCompleted({ step1: false, step2: false, step3: false });
    setStepSkipped({ step1: false, step2: false, step3: false });
    setShowNavigationButtons(false);
  };

  const points = problems[currentProblem];
  const slope = points ? (points.y2 - points.y1) / (points.x2 - points.x1) : 0;
  const yIntercept = points ? points.y1 - (slope * points.x1) : 0;

  // Generate chart data for the current line
  const chartData = Array.from({ length: 11 }, (_, i) => ({
    x: i - 5,
    y: slope * (i - 5) + yIntercept
  }));

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className={`px-4 ${showSteps ? 'pt-4' : 'p-4'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Line Equation Calculator</h2>
            <Button 
              onClick={nextProblem}
              className="bg-[#008545] hover:bg-[#00703d] text-white px-4 h-[42px] flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Problem
            </Button>
          </div>

          {points && (
            <div className="space-y-4">
              {/* Combined Points Table and Chart */}
              <div className="rounded-lg mb-4">
                {/* Points Text */}
                <div className="text-center mb-4">
                  <p className="text-lg font-medium text-gray-800">
                    Find the equation of a line with points<br />
                    ({points.x1}, {points.y1}) and ({points.x2}, {points.y2})
                  </p>
                </div>

                {/* Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal vertical />
                      <XAxis dataKey="x" domain={[-5, 5]} type="number" tickCount={11} />
                      <YAxis domain={[-10, 10]} tickCount={11} />
                      <Line type="monotone" dataKey="y" stroke="#2563eb" dot={false} />
                      <ReferenceDot x={points.x1} y={points.y1} r={4} fill="#dc2626" />
                      <ReferenceDot x={points.x2} y={points.y2} r={4} fill="#dc2626" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {!showSteps ? (
                <div className={`glow-button ${!showSteps ? 'simple-glow' : 'simple-glow stopped'}`}>
                  <button 
                    onClick={startCalculation}
                    className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm py-2 rounded"
                  >
                    Find Line Equation
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 -mx-4 -mb-4">
                  <div className="p-4">
                    <div className="space-y-2">
                      <h3 className="text-[#5750E3] text-sm font-medium mb-2">
                        Steps to find the line equation:
                      </h3>
                      <div className="space-y-4">
                        <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                          <p className="text-sm font-semibold">
                            {currentStep === 1 && "Step 1: Calculate the slope using the slope formula"}
                            {currentStep === 2 && "Step 2: Find the y-intercept using point-slope form"}
                            {currentStep === 3 && "Step 3: Write the final equation in slope-intercept form"}
                          </p>
                          {currentStep === 1 && (
                            <div className="pl-6 my-2 text-sm text-gray-600">
                              <p>m = <span className="inline-block align-middle">
                                <div className="border-b border-gray-600">y₂ - y₁</div>
                                <div>x₂ - x₁</div>
                              </span></p>
                            </div>
                          )}
                          {currentStep === 1 && (
                            <>
                              {!stepCompleted.step1 ? (
                                <div className="flex items-center space-x-1 mt-2">
                                  <input
                                    type="number"
                                    step="any"
                                    value={step1Answer}
                                    onChange={(e) => {
                                      setStep1Answer(e.target.value);
                                      setInvalidAnswers(prev => ({ ...prev, step1: false }));
                                    }}
                                    placeholder="Enter slope"
                                    className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                                      invalidAnswers.step1 ? 'border-yellow-500' : 'border-gray-300'
                                    }`}
                                  />
                                  <div className="glow-button simple-glow">
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={checkStep1}
                                        className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                                      >
                                        Check
                                      </button>
                                      <button 
                                        onClick={() => skipStep(1)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                                      >
                                        Skip
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-[#008545] font-medium mt-1">
                                    Slope = {slope.toFixed(2)}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 justify-end">
                                    {!stepSkipped.step1 && !showNavigationButtons && (
                                      <span className="text-green-600 font-bold select-none">Great Job!</span>
                                    )}
                                    {!showNavigationButtons && (
                                      <div className="glow-button simple-glow">
                                        <button 
                                          onClick={() => setCurrentStep(2)}
                                          className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                                        >
                                          Continue
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {currentStep === 2 && (
                            <>
                              {!stepCompleted.step2 ? (
                                <div className="flex items-center space-x-1 mt-2">
                                  <input
                                    type="number"
                                    step="any"
                                    value={step2Answer}
                                    onChange={(e) => {
                                      setStep2Answer(e.target.value);
                                      setInvalidAnswers(prev => ({ ...prev, step2: false }));
                                    }}
                                    placeholder="Enter y-intercept"
                                    className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                                      invalidAnswers.step2 ? 'border-yellow-500' : 'border-gray-300'
                                    }`}
                                  />
                                  <div className="glow-button simple-glow">
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={checkStep2}
                                        className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                                      >
                                        Check
                                      </button>
                                      <button 
                                        onClick={() => skipStep(2)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                                      >
                                        Skip
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-[#008545] font-medium mt-1">
                                    Y-intercept = {yIntercept.toFixed(2)}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 justify-end">
                                    {!stepSkipped.step2 && !showNavigationButtons && (
                                      <span className="text-green-600 font-bold select-none">Great Job!</span>
                                    )}
                                    {!showNavigationButtons && (
                                      <div className="glow-button simple-glow">
                                        <button 
                                          onClick={() => setCurrentStep(3)}
                                          className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                                        >
                                          Continue
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {currentStep === 3 && (
                            <>
                              {!stepCompleted.step3 ? (
                                <div className="flex items-center space-x-1 mt-2">
                                  <input
                                    type="text"
                                    value={step3Answer}
                                    onChange={(e) => {
                                      setStep3Answer(e.target.value);
                                      setInvalidAnswers(prev => ({ ...prev, step3: false }));
                                    }}
                                    placeholder="e.g., y = 2x + 1"
                                    className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                                      invalidAnswers.step3 ? 'border-yellow-500' : 'border-gray-300'
                                    }`}
                                  />
                                  <div className="glow-button simple-glow">
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={checkStep3}
                                        className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                                      >
                                        Check
                                      </button>
                                      <button 
                                        onClick={() => skipStep(3)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                                      >
                                        Skip
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-[#008545] font-medium mt-1">
                                    {(() => {
                                      let equation;
                                      if (yIntercept === 0) {
                                        if (slope === 1) {
                                          equation = 'y = x';
                                        } else if (slope === -1) {
                                          equation = 'y = -x';
                                        } else {
                                          equation = `y = ${slope}x`;
                                        }
                                      } else {
                                        if (slope === 1) {
                                          equation = `y = x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
                                        } else if (slope === -1) {
                                          equation = `y = -x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
                                        } else {
                                          equation = `y = ${slope}x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
                                        }
                                      }
                                      return equation;
                                    })()}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 justify-end">
                                    {!stepSkipped.step3 && !showNavigationButtons && (
                                      <span className="text-green-600 font-bold select-none">Great Job!</span>
                                    )}
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-4">
                          <div
                            className="nav-orbit-wrapper"
                            style={{
                              position: 'relative',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              visibility: showNavigationButtons && currentStep > 1 ? 'visible' : 'hidden',
                              opacity: showNavigationButtons && currentStep > 1 ? 1 : 0,
                              pointerEvents: showNavigationButtons && currentStep > 1 ? 'auto' : 'none',
                              transition: 'opacity 0.2s ease',
                            }}
                          >
                            <div className="nav-button-orbit"></div>
                            <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                            <button
                              onClick={() => handleNavigateHistory('back')}
                              className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6"/>
                              </svg>
                            </button>
                          </div>
                          <span className="text-sm text-gray-500 min-w-[100px] text-center">
                            Step {currentStep} of 3
                          </span>
                          <div
                            className="nav-orbit-wrapper"
                            style={{
                              position: 'relative',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              visibility: showNavigationButtons && currentStep < 3 ? 'visible' : 'hidden',
                              opacity: showNavigationButtons && currentStep < 3 ? 1 : 0,
                              pointerEvents: showNavigationButtons && currentStep < 3 ? 'auto' : 'none',
                              transition: 'opacity 0.2s ease',
                            }}
                          >
                            <div className="nav-button-orbit"></div>
                            <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                            <button
                              onClick={() => handleNavigateHistory('forward')}
                              className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TwoPointEquation;