import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var require: any
@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css']
})
export class SpeechToTextComponent implements OnInit {
  recognizedText: string = '';
  openAiApiKey = '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';
  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}
  ngOnInit(): void {
    const Annyang = require('annyang');
    if (Annyang) {
      Annyang.addCallback('result', (userSaid: string[]) => {
        const bestMatch = userSaid[0]; // Get the first result with highest confidence
        this.recognizedText = bestMatch;
        // You can add logic here to process the recognized text.
        console.log(this.recognizedText);
        this.cdr.detectChanges();
      });

      // Start listening to user speech
      Annyang.start();
    }
  }

  getOpenAIResponse(text: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.openAiApiKey}`
    });

    const prompt = text; // You can modify the prompt text if needed
    const data = {
      prompt,
      max_tokens: 100 // Adjust the number of tokens in the response as needed
    };

    this.http.post<any>('https://api.openai.com/v1/engines/davinci-codex/completions', data, { headers })
      .subscribe(
        (response) => {
          // Handle the response from OpenAI API
          console.log('OpenAI Response:', response);
          const openAIResponse = response.choices[0].text;
          console.log('Generated Text:', openAIResponse);
          // You can display the openAIResponse in your UI or perform further processing.
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
