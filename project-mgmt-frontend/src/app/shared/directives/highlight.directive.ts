import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: 'low' | 'medium' | 'high' = 'medium';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const colors: { [key: string]: string } = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444'
    };

    this.renderer.setStyle(
      this.el.nativeElement,
      'border-left',
      `4px solid ${colors[this.appHighlight]}`
    );
  }
}
