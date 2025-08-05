import {type FormEvent, useState, useRef} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadProgressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    // Simulate upload progress for better user experience
    const simulateUploadProgress = () => {
        setUploadProgress(0);
        
        // Clear any existing timer
        if (uploadProgressTimerRef.current) {
            clearInterval(uploadProgressTimerRef.current);
        }
        
        // Simulate progress from 0 to 95% (leaving the last 5% for completion)
        let progress = 0;
        uploadProgressTimerRef.current = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 95) {
                progress = 95;
                if (uploadProgressTimerRef.current) {
                    clearInterval(uploadProgressTimerRef.current);
                }
            }
            setUploadProgress(Math.round(progress));
        }, 200);
    };
    
    const completeUploadProgress = () => {
        setUploadProgress(100);
        if (uploadProgressTimerRef.current) {
            clearInterval(uploadProgressTimerRef.current);
            uploadProgressTimerRef.current = null;
        }
    };

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        simulateUploadProgress();
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) {
            setStatusText('Error: Failed to upload file');
            return;
        }
        completeUploadProgress();

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) {
            setStatusText('Error: Failed to convert PDF to image');
            return;
        }

        setStatusText('Uploading the image...');
        simulateUploadProgress();
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) {
            setStatusText('Error: Failed to upload image');
            return;
        }
        completeUploadProgress();

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="Resume scanning animation" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mt-8">
                            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-div">
                                        <label htmlFor="company-name" className="text-base font-medium mb-1 block">Company Name</label>
                                        <input 
                                            type="text" 
                                            name="company-name" 
                                            placeholder="Enter the company you're applying to" 
                                            id="company-name"
                                            className="focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="form-div">
                                        <label htmlFor="job-title" className="text-base font-medium mb-1 block">Job Title</label>
                                        <input 
                                            type="text" 
                                            name="job-title" 
                                            placeholder="Enter the position you're applying for" 
                                            id="job-title" 
                                            className="focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-div">
                                    <label htmlFor="job-description" className="text-base font-medium mb-1 block">Job Description</label>
                                    <div className="relative">
                                        <textarea 
                                            rows={5} 
                                            name="job-description" 
                                            placeholder="Paste the job description here for better analysis" 
                                            id="job-description" 
                                            className="focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                            For best results, include the full job description
                                        </div>
                                    </div>
                                </div>

                                <div className="form-div mt-4">
                                    <label htmlFor="uploader" className="text-base font-medium mb-2 block">Upload Resume</label>
                                    <FileUploader 
                                        onFileSelect={handleFileSelect} 
                                        uploadProgress={isProcessing ? uploadProgress : 0} 
                                    />
                                </div>

                                <button 
                                    className="primary-button mt-6 py-4 text-xl font-semibold hover:primary-gradient-hover transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed" 
                                    type="submit"
                                    disabled={!file}
                                >
                                    {file ? "Analyze Resume" : "Upload a resume to continue"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload;