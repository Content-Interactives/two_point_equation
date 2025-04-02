import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceDot, ResponsiveContainer } from 'recharts';

const TwoPointEquation = () => {
  const [practiceAnswers, setPracticeAnswers] = useState({
    slope: '',
    yIntercept: '',
    equation: ''
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [step3Complete, setStep3Complete] = useState(false);
  const [hasError, setHasError] = useState({
    step1: false,
    step2: false,
    step3: false
  });

  // Example points in Q1 (x > 0, y > 0)
  const exampleData = Array.from({ length: 6 }, (_, i) => ({
    x: i,
    y: 2 * i + 1 // y = 2x + 1
  }));

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

  const [currentPoints, setCurrentPoints] = useState(generatePoints);

  const handleStep3Check = () => {
    const slope = (currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1);
    const yIntercept = currentPoints.y1 - (slope * currentPoints.x1);
    
    // Remove all spaces and convert to lowercase for comparison
    const userEquation = practiceAnswers.equation.replace(/\s+/g, '').toLowerCase();
    
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
    setHasError(prev => ({ ...prev, step3: !isCorrect }));
    if (isCorrect) setStep3Complete(true);
  };

  const handleNewQuestion = () => {
    setShowAnswer(false);
    setStep1Complete(false);
    setStep2Complete(false);
    setStep3Complete(false);
    setPracticeAnswers({ slope: '', yIntercept: '', equation: '' });
    setHasError({ step1: false, step2: false, step3: false });
    setCurrentPoints(generatePoints());
  };

  const handleStep1Check = () => {
    const slope = (currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1);
    const isCorrect = Math.abs(parseFloat(practiceAnswers.slope) - slope) < 0.01;
    setHasError(prev => ({ ...prev, step1: !isCorrect }));
    if (isCorrect) setStep1Complete(true);
  };

  const handleStep2Check = () => {
    const slope = (currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1);
    // Using point-slope form to find y-intercept: y = mx + b => b = y - mx
    const yIntercept = currentPoints.y1 - (slope * currentPoints.x1);
    const isCorrect = Math.abs(parseFloat(practiceAnswers.yIntercept) - yIntercept) < 0.01;
    setHasError(prev => ({ ...prev, step2: !isCorrect }));
    if (isCorrect) setStep2Complete(true);
  };

  return (
    <div className="bg-gray-100 p-8 w-[780px] overflow-auto">
      <Card className="w-[748px] mx-auto shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg w-[748px]">
          <h1 className="text-sky-900 text-2xl font-bold">Line Equation Learning</h1>
          <p className="text-sky-800">Learn how to find the equation of a line using two points!</p>
        </div>

        <CardContent className="space-y-6 pt-6 w-[748px]">
          {/* Definition Box */}
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-1">Finding Line Equations</h2>
            <p className="text-blue-600">
              To find the equation of a line using two points, we need to find the line's y-intercept and slope. 
              To find the slope, we use the slope formula:
            </p>
            <div className="text-center font-bold my-2 text-blue-800">
              m = <div className="inline-block align-middle">
                <div className="border-b border-blue-800">y₂ - y₁</div>
                <div>x₂ - x₁</div>
              </div>
            </div>
            <p className="text-blue-600 mb-1">
              Then we can use the slope-intercept form to find our y-intercept:
            </p>
            <div className="text-center font-bold my-2 text-blue-800">
              y = mx + b
            </div>
          </div>

          {/* Example Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Example</h2>
            <Card className="border border-gray-200">
              <CardContent className="p-6 pt-6">
                <p className="text-lg font-bold mb-4 text-center">Find the equation using (1, 3) and (2, 5)</p>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exampleData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        horizontal 
                        vertical
                      />
                      <XAxis dataKey="x" domain={[0, 5]} type="number" tickCount={6} />
                      <YAxis 
                        domain={[0, 10]} 
                        ticks={[0,2,4,6,8,10]}
                        interval={0}
                        allowDataOverflow={true}
                      />
                      <Line type="monotone" dataKey="y" stroke="#2563eb" dot={false} />
                      <ReferenceDot x={1} y={3} r={4} fill="#dc2626" />
                      <ReferenceDot x={2} y={5} r={4} fill="#dc2626" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-4">
                  <div>
                    <p className="text-base text-gray-800">
                      <span className="font-bold">Step 1: </span>
                      Calculate the slope by plugging in the two points (1, 3) and (2, 5) into the slope formula
                    </p>
                    <p className="text-lg text-center">
                      m = <div className="inline-block align-middle">
                        <div className="border-b border-black">y₂ - y₁</div>
                        <div>x₂ - x₁</div>
                      </div><br />
                      m = <div className="inline-block align-middle">
                        <div className="border-b border-black">5 - 3</div>
                        <div>2 - 1</div>
                      </div><br />
                      m = <div className="inline-block align-middle">
                        <div className="border-b border-black">2</div>
                        <div>1</div>
                      </div><br />
                      m = 2
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-800">
                      <span className="font-bold">Step 2: </span>
                      Use either point and the slope we found previously to find the y-intercept by solving the slope-intercept equation
                    </p>
                    <p className="text-lg text-center">
                      y = mx + b<br />
                      3 = 2(1) + b<br />
                      3 = 2 + b<br />
                      b = 1
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-800">
                      <span className="font-bold">Step 3: </span>
                      Write the final equation in slope-intercept form
                    </p>
                    <p className="text-lg text-center">y = 2x + 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Practice Section */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={handleNewQuestion}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Question
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg mb-6 text-center">
              <p className="text-xl font-bold mb-4">Find the equation of the line through these points:</p>
              <p className="text-lg">
                ({currentPoints.x1}, {currentPoints.y1}) and 
                ({currentPoints.x2}, {currentPoints.y2})
              </p>
            </div>

            <Button 
              onClick={() => {
                setShowAnswer(true);
                setStep1Complete(false);
                setStep2Complete(false);
                setStep3Complete(false);
                setPracticeAnswers({ slope: '', yIntercept: '', equation: '' });
                setHasError({ step1: false, step2: false, step3: false });
              }}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showAnswer && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p>1. Use the slope formula to find the slope (m):</p>
                <div className="flex items-center gap-4 my-4">
                  {step1Complete ? (
                    <span className="text-green-600 font-medium">
                      {((currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1))}
                    </span>
                  ) : (
                                          <Input 
                      type="number"
                      placeholder="Enter slope"
                      value={practiceAnswers.slope}
                      onChange={(e) => {
                        setPracticeAnswers(prev => ({ ...prev, slope: e.target.value }));
                        setHasError(prev => ({ ...prev, step1: false }));
                      }}
                      className={`w-32 ${
                        hasError.step1 ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                      }`}
                      step="any"
                    />
                  )}
                  {!step1Complete && (
                    <div className="flex gap-4">
                      <Button
                        onClick={handleStep1Check}
                        className="bg-blue-400 hover:bg-blue-500"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => setStep1Complete(true)}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>

                {step1Complete && (
                  <>
                    <p>2. Use the slope-intercept equation to find the y-intercept (b):</p>
                    <div className="flex items-center gap-4 my-4">
                      {step2Complete ? (
                        <span className="text-green-600 font-medium">
                          {(currentPoints.y1 - ((currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1)) * currentPoints.x1)}
                        </span>
                      ) : (
                                                  <Input 
                          type="number"
                          placeholder="Enter y-intercept"
                          value={practiceAnswers.yIntercept}
                          onChange={(e) => {
                            setPracticeAnswers(prev => ({ ...prev, yIntercept: e.target.value }));
                            setHasError(prev => ({ ...prev, step2: false }));
                          }}
                          className={`w-32 ${
                            hasError.step2 ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                          }`}
                          step="any"
                        />
                      )}
                      {!step2Complete && (
                        <div className="flex gap-4">
                          <Button
                            onClick={handleStep2Check}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => setStep2Complete(true)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {step2Complete && (
                  <>
                    <p>3. Write the equation of the line in slope-intercept form:</p>
                    <div className="flex items-center gap-4 my-4">
                      {step3Complete ? (
                        <span className="text-green-600 font-medium">
                          {(() => {
                            const slope = (currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1);
                            const yIntercept = currentPoints.y1 - (slope * currentPoints.x1);
                            
                            if (yIntercept === 0) {
                              if (slope === 1) return 'y = x';
                              if (slope === -1) return 'y = -x';
                              return `y = ${slope}x`;
                            } else {
                              if (slope === 1) return `y = x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
                              if (slope === -1) return `y = -x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
                              return `y = ${slope}x ${yIntercept >= 0 ? '+ ' : '- '}${Math.abs(yIntercept)}`;
                            }
                          })()}
                        </span>
                      ) : (
                        <Input 
                          type="text"
                          placeholder="e.g., y = 2x + 1"
                          value={practiceAnswers.equation}
                          onChange={(e) => {
                            setPracticeAnswers(prev => ({ ...prev, equation: e.target.value }));
                            setHasError(prev => ({ ...prev, step3: false }));
                          }}
                          className={`w-48 ${
                            hasError.step3 ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                          }`}
                        />
                      )}
                      {!step3Complete && (
                        <div className="flex gap-4">
                          <Button
                            onClick={handleStep3Check}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => setStep3Complete(true)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {step3Complete && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                    <p className="text-green-700">
                      {(() => {
                        const slope = (currentPoints.y2 - currentPoints.y1) / (currentPoints.x2 - currentPoints.x1);
                        const yIntercept = currentPoints.y1 - (slope * currentPoints.x1);
                        
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
                        
                        return `You've successfully found all parts of the line equation: ${equation}`;
                      })()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding line equations is essential for algebra and beyond!
      </p>
    </div>
  );
};

export default TwoPointEquation;