import React, { useState, useCallback } from "react";
import {
  Copy,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Eye,
  Zap,
  Brain,
  Clock,
  Target,
} from "lucide-react";
import { nanoid } from "nanoid";
import ExamplePair from "./ExamplePair";
import ModelCard from "./ModelCard";

const PromptingStudio = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [examples, setExamples] = useState([
    { id: nanoid(), input: "", output: "" },
  ]);
  const [formData, setFormData] = useState({
    mainTask: "",
    modelType: "gpt",
    identity: "",
    instructions: "",
    constraints: "",
    context: "",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  /* ---------- memoised handlers ---------- */
  const handleInputChange = useCallback(
    (field, value) =>
      setFormData((p) => ({
        ...p,
        [field]: value,
      })),
    []
  );

  const handleExampleChange = useCallback((id, field, value) => {
    setExamples((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  }, []);

  const addExample = useCallback(
    () =>
      setExamples((prev) => [...prev, { id: nanoid(), input: "", output: "" }]),
    []
  );

  const removeExample = useCallback(
    (id) => setExamples((prev) => prev.filter((ex) => ex.id !== id)),
    []
  );

  /* ---------- Prompt builder ---------- */
  const generatePrompt = useCallback(() => {
    if (!formData.mainTask.trim()) return;

    const {
      modelType,
      identity,
      instructions,
      constraints,
      context,
      mainTask,
    } = formData;

    const nl = "\n\n";
    let prompt = "";

    if (modelType === "reasoning") {
      if (identity.trim()) prompt += `${identity.trim()}${nl}`;
      if (context.trim()) prompt += `<context>\n${context.trim()}\n</context>${nl}`;
      prompt += mainTask.trim();
      if (constraints.trim())
        prompt += `${nl}Please ensure: ${constraints.trim()}`;
    } else {
      if (identity.trim()) prompt += `# Identity${nl}${identity.trim()}${nl}`;
      if (instructions.trim() || constraints.trim()) {
        prompt += `# Instructions${nl}`;
        if (instructions.trim()) prompt += `${instructions.trim()}${nl}`;
        if (constraints.trim()) {
          const list = constraints
            .split("\n")
            .map((c) => c.trim())
            .filter(Boolean)
            .map((c) => `• ${c}`)
            .join("\n");
          prompt += `${list}${nl}`;
        }
      }
      if (examples.some((ex) => ex.input.trim() || ex.output.trim())) {
        prompt += `# Examples${nl}`;
        examples.forEach(({ input, output }, idx) => {
          if (input.trim() || output.trim()) {
            prompt += `**Example ${idx + 1}:**\nInput: ${input.trim()}\nOutput: ${output.trim()}${nl}`;
          }
        });
      }
      if (context.trim()) prompt += `# Context${nl}${context.trim()}${nl}`;
      prompt += `# Task${nl}${mainTask.trim()}`;
    }
    setGeneratedPrompt(prompt.trim());
  }, [formData, examples]);

  /* ---------- Utilities ---------- */
  const copyToClipboard = useCallback(async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
    } catch (err) {
      alert("Could not access clipboard – please copy manually.");
      console.error(err);
    }
  }, [generatedPrompt]);

  const downloadPrompt = useCallback(() => {
    if (!generatedPrompt) return;
    try {
      const blob = new Blob([generatedPrompt], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "ai-prompt.txt";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Download failed – see console for details.");
      console.error(err);
    }
  }, [generatedPrompt]);

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Prompt Studio</h1>
                <p className="text-sm text-gray-600">Create perfect prompts in seconds</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === 'builder' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                aria-label="Switch to prompt builder"
              >
                Prompt Builder
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'preview' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                aria-label="Switch to prompt preview"
              >
                <Eye className="w-4 h-4" />
                <span>Prompt Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Panel - Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Model Selection */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Your AI Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModelCard
                    type="gpt"
                    active={formData.modelType === "gpt"}
                    onSelect={() => handleInputChange("modelType", "gpt")}
                  />
                  <ModelCard
                    type="reasoning"
                    active={formData.modelType === "reasoning"}
                    onSelect={() => handleInputChange("modelType", "reasoning")}
                  />
                </div>
              </div>

              {/* Main Task - Priority #1 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">STEP 1</span>
                  <h3 className="text-lg font-semibold text-gray-900">What do you want the AI to do?</h3>
                </div>
                <label htmlFor="mainTask" className="sr-only">Describe your main task</label>
                <textarea
                  id="mainTask"
                  value={formData.mainTask}
                  onChange={(e) => handleInputChange('mainTask', e.target.value)}
                  placeholder="Describe your task clearly. For example: 'Write a product description for a wireless headphone' or 'Analyze this data and find trends'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none text-sm bg-white/50"
                />
                <p className="text-xs text-gray-500 mt-2">This is the only required field. The more specific you are, the better results you'll get!</p>
              </div>

              {/* Advanced Options Toggle */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-left group"
                  aria-expanded={showAdvanced}
                  aria-controls="advanced-options"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Advanced Options</h3>
                    <p className="text-sm text-gray-600">Optional settings to make your prompt even better</p>
                  </div>
                  <div className={`p-2 rounded-lg border transition-all ${showAdvanced ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    {showAdvanced ? (
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {showAdvanced && (
                  <div id="advanced-options" className="mt-8 space-y-6">
                    {/* AI Role/Personality */}
                    <div>
                      <label htmlFor="identity" className="block text-sm font-medium text-gray-700 mb-2">
                        AI Role & Personality (Optional)
                      </label>
                      <textarea
                        id="identity"
                        value={formData.identity}
                        onChange={(e) => handleInputChange('identity', e.target.value)}
                        placeholder="How should the AI behave? Example: 'You are a friendly marketing expert' or 'Act as a professional data analyst'"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none text-sm bg-white/50"
                      />
                    </div>

                    {/* Step-by-step Instructions */}
                    {formData.modelType === 'gpt' && (
                      <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                          Step-by-step Instructions (Optional)
                        </label>
                        <textarea
                          id="instructions"
                          value={formData.instructions}
                          onChange={(e) => handleInputChange('instructions', e.target.value)}
                          placeholder="Break down how the AI should complete the task. Example: '1. First, read the document 2. Then identify key points 3. Finally, summarize in bullet points'"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none text-sm bg-white/50"
                        />
                        <p className="text-xs text-gray-500 mt-1">How to do the task - GPT models work better with detailed instructions</p>
                      </div>
                    )}

                    {/* Requirements & Constraints */}
                    <div>
                      <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements & Constraints (Optional)
                      </label>
                      <textarea
                        id="constraints"
                        value={formData.constraints}
                        onChange={(e) => handleInputChange('constraints', e.target.value)}
                        placeholder="What rules should the AI follow? Example: 'Keep it under 100 words' or 'Use simple language' or 'Don't include personal opinions'"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none text-sm bg-white/50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rules to follow - what the AI should and shouldn't do</p>
                    </div>

                    {/* Examples - Only for GPT models */}
                    {formData.modelType === 'gpt' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Example Pairs (Optional)
                            </label>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full" title="Skip this section unless you need a precise format">ⓘ Skip unless needed</span>
                          </div>
                          <button
                            onClick={addExample}
                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
                            aria-label="Add example pair"
                          >
                            + Add Example
                          </button>
                        </div>
                        
                        {/* Crisp explanation */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <p className="text-sm text-green-700 mb-3">
                            Add 1-3 input-output pairs so the model learns the exact style you expect.
                          </p>
                          
                          <div className="text-xs text-green-600 bg-white/70 p-3 rounded-lg border border-green-200">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="font-medium">You give:</span><br/>
                                "This product is amazing!"
                              </div>
                              <div>
                                <span className="font-medium">AI should reply:</span><br/>
                                "Positive feedback"
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Examples Interface */}
                        {examples.map((example, index) => (
                          <ExamplePair
                            key={example.id}
                            id={example.id}
                            idx={index}
                            input={example.input}
                            output={example.output}
                            onChange={handleExampleChange}
                            onRemove={removeExample}
                            disableRemove={examples.length === 1}
                          />
                        ))}
                      </div>
                    )}

                    {/* Additional Context */}
                    <div>
                      <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Context (Optional)
                      </label>
                      <textarea
                        id="context"
                        value={formData.context}
                        onChange={(e) => handleInputChange('context', e.target.value)}
                        placeholder="Any background information the AI should know? Company details, specific data, or relevant facts?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none text-sm bg-white/50"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={generatePrompt}
                  disabled={!formData.mainTask.trim()}
                  className={`px-8 py-4 rounded-xl flex items-center space-x-3 font-medium text-white transition-all ${
                    formData.mainTask.trim() 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-200' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Generate prompt"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Create My Prompt</span>
                </button>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-2 lg:sticky lg:top-32">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Prompt</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      disabled={!generatedPrompt}
                      className={`p-2.5 rounded-lg transition-all ${
                        generatedPrompt 
                          ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="Copy prompt to clipboard"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadPrompt}
                      disabled={!generatedPrompt}
                      className={`p-2.5 rounded-lg transition-all ${
                        generatedPrompt 
                          ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="Download prompt as file"
                      title="Download as file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 h-96 overflow-y-auto bg-gray-50/50">
                  {generatedPrompt ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                      {generatedPrompt}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="mb-2 font-medium">Enter your task above and click</p>
                        <p className="text-sm">"Create My Prompt"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for {formData.modelType === 'gpt' ? 'GPT' : 'Reasoning'} Models</h4>
                <div className="text-sm text-blue-800 space-y-2">
                  {formData.modelType === 'gpt' ? (
                    <>
                      <p>• Be specific and detailed in your instructions</p>
                      <p>• Break down complex tasks into clear steps</p>
                      <p>• Examples help a lot - show exactly what you want</p>
                      <p>• Specify the exact format you want back</p>
                    </>
                  ) : (
                    <>
                      <p>• Keep it simple - just describe your goal</p>
                      <p>• Let the AI figure out the details and steps</p>
                      <p>• Examples often aren't needed (try without first)</p>
                      <p>• Perfect for unclear or complex problems</p>
                    </>
                  )}
                </div>
                
                {/* Examples guidance based on model type */}
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-blue-200/50">
                  <p className="text-xs text-blue-700">
                    <strong>About Examples:</strong> {formData.modelType === 'gpt' 
                      ? 'GPT models benefit greatly from 2-3 good examples showing the format you want.'
                      : 'Reasoning models often work well without examples. Try your task first, then add examples only if needed.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Final Prompt</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!generatedPrompt}
                    className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 font-medium transition-all ${
                      generatedPrompt 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                    aria-label="Copy prompt to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={downloadPrompt}
                    disabled={!generatedPrompt}
                    className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 font-medium transition-all ${
                      generatedPrompt 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                    aria-label="Download prompt as file"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50/50 min-h-96">
                {generatedPrompt ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed">
                      {generatedPrompt}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No prompt created yet</h3>
                      <p>Go to the Builder tab and describe your task to get started.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptingStudio;